import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  AuthData,
  CronJobData,
  Interval,
  ItemExpanded,
  ItemShallow,
  PricePoint,
  Product,
  Seller,
  SellerRole,
  Subscriber,
  Transaction,
} from "./types";

const RETRY_TIMEOUT = 5000;

type State = {
  seller: Seller;
  jwt: string | null;
  refresh: React.MutableRefObject<Date | null> | null;
};

const JWT_TOKEN = "spos-jwt";
const SELLER_TOKEN = "spos-seller";

const state_: State = {
  seller: {
    role: SellerRole.UNKNOWN,
  } as Seller,
  jwt: null,
  refresh: null,
};

const client_: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api`,
});

axiosRetry(client_, { retries: 5 });

const fetchFromStorage = () => {
  const jwt = localStorage.getItem(JWT_TOKEN);
  const seller = localStorage.getItem(SELLER_TOKEN);
  if (jwt && seller) {
    state_.jwt = jwt;
    state_.seller = JSON.parse(seller);
  }
};

const saveToStorage = () => {
  if (state_.jwt && state_.seller) {
    localStorage.setItem(JWT_TOKEN, state_.jwt);
    localStorage.setItem(SELLER_TOKEN, JSON.stringify(state_.seller));
  }
};

const updateState = (data: AuthData) => {
  state_.jwt = data.token;
  state_.seller = data.user;
  saveToStorage();
};

const buildRequest = (path: string, method: string, body: {}) => {
  let req = {};
  if (state_.jwt) {
    req = {
      headers: {
        Authorization: `Bearer ${state_.jwt}`,
      },
    };
  }
  req = { method, url: path, ...req, data: body };
  return req;
};

const execReq = async (
  method: string,
  path: string,
  body: {},
  silent: boolean = false
) => {
  try {
    if (!silent) toast.loading("executing...");
    const req = buildRequest(path, method, body);
    const res = await client_.request(req);
    if (!silent) toast.dismiss();
    if (!silent) toast.success("success");
    return res.data;
  } catch (e) {
    if (!silent) toast.dismiss();
    toast.error("something went wrong...");
  }
  return null;
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const initLoad = useRef(true);
  if (initLoad.current) {
    initLoad.current = false;
    api.products.list().then((data) => setProducts(data));
  }
  state_.refresh = useRef(new Date(0));
  useEffect(() => {
    const interval = setInterval(async () => {
      const newest = await api.lastExecution();
      if (
        !state_.refresh!.current ||
        (newest && newest > state_.refresh!.current)
      ) {
        state_.refresh!.current = newest;
        console.log("updating pricing");
        setProducts(await api.products.list());
        toast.success("Pricing updated");
      }
    }, RETRY_TIMEOUT);
    return () => clearInterval(interval);
  }, []);

  return products;
};

const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const initLoad = useRef(true);
  if (initLoad.current) {
    initLoad.current = false;
    api.transactions.list().then((data) => setTransactions(data));
  }
  useEffect(() => {
    const interval = setInterval(async () => {
      const newest = await api.lastExecution();
      if (
        !state_.refresh!.current ||
        (newest && newest > state_.refresh!.current)
      ) {
        state_.refresh!.current = newest;
        console.log("updating transactions");
        setTransactions(await api.transactions.list());
      }
    }, RETRY_TIMEOUT * 10);
    return () => clearInterval(interval);
  }, []);

  return transactions;
}

const api = {
  user: {
    role: (): SellerRole => {
      return state_.seller.role;
    },
    loggedIn: (): boolean => {
      return state_.jwt !== null;
    },
  },
  auth: {
    login: async (username: string, password: string): Promise<Seller> => {
      const res = await execReq("POST", "/auth/login", { username, password });
      updateState(res);
      return res.user;
    },
    logout: async (): Promise<void> => {
      localStorage.removeItem(JWT_TOKEN);
      localStorage.removeItem(SELLER_TOKEN);
      state_.jwt = null;
      state_.seller = { role: SellerRole.UNKNOWN } as Seller;
      window.location.href = "/";
    },
    whoami: async (): Promise<Seller> => {
      const res = await execReq("GET", "/auth/whoami", {});
      return res.user;
    },
  },
  events: {
    list: async (): Promise<string[]> => {
      const res = await execReq("GET", "/events", {}, true);
      return res?.events;
    }
  },
  products: {
    useProducts,
    invalidate: () => {
      if (state_.refresh?.current) state_.refresh.current = null;
    },
    list: async (): Promise<Product[]> => {
      const res = await execReq("GET", "/product", {}, true);
      res.products.forEach((p: Product) => {
        // map timestamps of prices to dates and sort accordingly (newest first)
        p.price_points = p.price_points
          .map((pp: PricePoint) => ({
            ...pp,
            timestamp: (pp.timestamp = new Date(pp.timestamp)),
          }))
          .sort(
            (a: PricePoint, b: PricePoint) =>
              b.timestamp.getTime() - a.timestamp.getTime()
          );
      });
      return res?.products;
    },
    find: async (id: number): Promise<Product> => {
      const res = await execReq("GET", `/product/${id}`, {}, true);
      return res?.product;
    },
    create: async (
      name: string,
      initialValue: number,
      minimumValue: number
    ): Promise<Product> => {
      const res = await execReq("POST", "/product", {
        name,
        initial_value: initialValue,
        minimum_value: minimumValue,
      });
      return res?.product;
    },
    update: async (
      id: number,
      toUpdate = { name: null, initialValue: null, minimumValue: null }
    ): Promise<Product> => {
      const res = await execReq("PUT", `/product/${id}`, {
        name: toUpdate.name,
        initial_value: toUpdate.initialValue,
        minimum_value: toUpdate.minimumValue,
      });
      return res?.product;
    },
    delete: async (id: number): Promise<Product> => {
      const res = await execReq("DELETE", `/product/${id}`, {});
      return res?.success ?? false;
    },
  },
  price_points: {
    create: async (productId: number, value: number): Promise<Product> => {
      const res = await execReq("POST", `/price_point/${productId}`, {
        value,
      });
      return res?.product;
    },
    reset: async (): Promise<Product> => {
      const res = await execReq("POST", `/price_point/reset`, {});
      return res?.success;
    },
  },
  transactions: {
    useTransactions,
    list: async (): Promise<Transaction[]> => {
      const res = await execReq("GET", "/transaction", {}, true);
      return res.transactions;
    },
    find: async (id: number): Promise<Transaction> => {
      const res = await execReq("GET", `/transaction/${id}`, {}, true);
      return res?.transaction;
    },
    delete: async (id: number): Promise<Transaction> => {
      const res = await execReq("DELETE", `/transaction/${id}`, {});
      return res?.success ?? false;
    },
    create: async (items: ItemExpanded[]): Promise<Transaction> => {
      const sitems: ItemShallow[] = items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        price_point_id: i.price_point.id,
      }));
      const res = await execReq("POST", "/transaction", { items: sitems });
      return res?.transaction;
    },
  },
  subscriber: {
    list: async (): Promise<Subscriber[]> => {
      const res = await execReq("GET", "/subscriber", {}, true);
      return res?.subscribers;
    },
    find: async (id: number): Promise<Subscriber> => {
      const res = await execReq("GET", `/subscriber/${id}`, {}, true);
      return res?.subscriber;
    },
    delete: async (id: string): Promise<boolean> => {
      const res = await execReq("DELETE", `/subscriber/${id}`, {});
      return res?.success;
    },
    trigger: async (id: string): Promise<boolean> => {
      const res = await execReq("POST", `/subscriber/${id}/trigger`, {});
      return res?.success;
    },
    create: async (
      id: string,
      events: string[],
      objects: string[],
      code: string
    ): Promise<Subscriber> => {
      const res = await execReq("POST", "/subscriber", {
        id,
        events,
        objects,
        code,
      });
      return res?.subscriber;
    },
    update: async (
      id: string,
      events: string[] | null = null,
      objects: string[] | null = null,
      code: string | null = null
    ) => {
      const res = await execReq("PUT", `/subscriber/${id}`, {
        events,
        objects,
        code,
      });
      return res?.subscriber;
    },
    validate: async (
      id: string,
      events: string[],
      objects: string[],
      code: string
    ): Promise<boolean> => {
      const res = await execReq("POST", "/subscriber/validate", {
        id,
        events,
        objects,
        code,
      });
      return res?.valid ?? false;
    },
  },
  lastExecution: async (): Promise<Date> => {
    const res = await execReq("GET", "/last_execution", {}, true);
    return new Date(res?.last_execution);
  },
  cron: {
    list: async (): Promise<CronJobData[]> => {
      const res = await execReq("GET", "/cron", {}, true);
      return res?.jobs;
    },
    find: async (id: string): Promise<CronJobData> => {
      const res = await execReq("GET", `/cron/${id}`, {}, true);
      return res?.job;
    },
    delete: async (id: string): Promise<boolean> => {
      const res = await execReq("DELETE", `/cron/${id}`, {});
      return res?.success ?? false;
    },
    create: async (
      id: string,
      event: string,
      interval: Interval
    ): Promise<CronJobData> => {
      const cronInterval = `${interval.seconds} */${interval.minutes} ${interval.hours} ${interval.days} ${interval.months} *`;

      const res = await execReq("POST", "/cron", {
        id,
        event,
        interval: cronInterval,
      });
      return res?.job;
    },
    pause: async (id: string): Promise<boolean> => {
      const res = await execReq("POST", `/cron/${id}/pause`, {});
      return res?.success ?? false;
    },
    restart: async (id: string): Promise<boolean> => {
      const res = await execReq("POST", `/cron/${id}/restart`, {});
      return res?.success ?? false;
    },
  },
  seller: {
    list: async (): Promise<Seller[]> => {
      const res = await execReq("GET", "/seller", {}, true);
      return res?.sellers;
    },
    find: async (id: number): Promise<Seller> => {
      const res = await execReq("GET", `/seller/${id}`, {}, true);
      return res?.seller;
    },
    delete: async (id: number): Promise<boolean> => {
      const res = await execReq("DELETE", `/seller/${id}`, {});
      return res?.succes;
    },
    create: async (
      username: string,
      password: string,
      role: SellerRole.ADMIN | SellerRole.DEFAULT
    ): Promise<Seller> => {
      const res = await execReq("POST", "/seller", {
        username,
        password,
        role,
      });
      return res?.seller;
    },
  },
};

export default api;

fetchFromStorage();
