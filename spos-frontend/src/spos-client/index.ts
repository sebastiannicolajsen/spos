import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { useEffect, useRef, useState } from "react";
import {
  AuthData,
  CronJobData,
  Interval,
  ItemShallow,
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
};

const JWT_TOKEN = "spos-jwt";
const SELLER_TOKEN = "spos-seller";

const state_: State = {
  seller: {
    role: SellerRole.UNKNOWN,
  } as Seller,
  jwt: null,
};

const client_: AxiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
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

const buildRequest = (path: string, body: {}) => {
  let req = {};
  if (state_.jwt) {
    req = {
      headers: {
        Authorization: `Bearer ${state_.jwt}`,
      },
    };
  }
  req = { url: path, ...req, data: body };
  return req;
};

const execReq = async (method: string, path: string, body: {}) => {
  try {
    const req = buildRequest(path, { method, ...body });
    const res = await client_.request(req);
    return res.data;
  } catch (e) {
    console.log(`A request went wrong '${method}' '${path}'`, e);
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
  const last = useRef(new Date(0));
  useEffect(() => {
    const interval = setInterval(async () => {
      const newest = await api.lastExecution();
      console.log("fetched newest", newest);
      if (newest && newest > last.current) {
        last.current = newest;
        console.log("updating pricing");
        setProducts(await api.products.list());
      }
    }, RETRY_TIMEOUT);
    return () => clearInterval(interval);
  }, []);

  return products;
};

const api = {
  user: {
    role: (): SellerRole => {
      return state_.seller.role;
    },
  },
  auth: {
    login: async (username: string, password: string): Promise<Seller> => {
      const res = await execReq("POST", "/auth/login", { username, password });
      updateState(res);
      return res.user;
    },
    whoami: async (): Promise<Seller> => {
      const res = await execReq("GET", "/auth/whoami", {});
      return res.user;
    },
  },
  products: {
    useProducts,
    list: async (): Promise<Product[]> => {
      const res = await execReq("GET", "/product", {});
      return res?.products;
    },
    find: async (id: number): Promise<Product> => {
      const res = await execReq("GET", `/product/${id}`, {});
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
      const res = await execReq("PUT", `/product/${id}`, toUpdate);
      return res?.product;
    },
    delete: async (id: number): Promise<Product> => {
      const res = await execReq("DELETE", `/product/${id}`, {});
      return res?.success ?? false;
    },
  },
  price_points: {
    create: async (productId: number, value: number): Promise<Product> => {
      const res = await execReq("POST", `/price_point`, {
        product_id: productId,
        value,
      });
      return res?.product;
    },
    reset: async (productId: number): Promise<Product> => {
      const res = await execReq(
        "DELETE",
        `/price_point/${productId}/reset`,
        {}
      );
      return res?.product;
    },
  },
  transactions: {
    list: async (): Promise<Transaction[]> => {
      const res = await execReq("GET", "/transaction", {});
      return res.transactions;
    },
    find: async (id: number): Promise<Transaction> => {
      const res = await execReq("GET", `/transaction/${id}`, {});
      return res?.transaction;
    },
    delete: async (id: number): Promise<Transaction> => {
      const res = await execReq("DELETE", `/transaction/${id}`, {});
      return res?.success ?? false;
    },
    create: async (items: ItemShallow): Promise<Transaction> => {
      const res = await execReq("POST", "/transaction", { items });
      return res?.transaction;
    },
  },
  subscriber: {
    list: async (): Promise<Subscriber[]> => {
      const res = await execReq("GET", "/subscriber", {});
      return res?.subscribers;
    },
    find: async (id: number): Promise<Subscriber> => {
      const res = await execReq("GET", `/subscriber/${id}`, {});
      return res?.subscriber;
    },
    delete: async (id: number): Promise<boolean> => {
      const res = await execReq("DELETE", `/subscriber/${id}`, {});
      return res?.success;
    },
    trigger: async (id: string) : Promise<boolean> => {
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
    const res = await execReq("GET", "/last_execution", {});
    return res?.last_execution;
  },
  cron: {
    list: async (): Promise<CronJobData[]> => {
      const res = await execReq("GET", "/cron", {});
      return res?.jobs;
    },
    find: async (id: string): Promise<CronJobData> => {
      const res = await execReq("GET", `/cron/${id}`, {});
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
      const cronInterval = `${interval.seconds} ${interval.minutes} ${interval.hours} ${interval.days} ${interval.months} *`;

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
    start: async (id: string): Promise<boolean> => {
      const res = await execReq("POST", `/cron/${id}/start`, {});
      return res?.success ?? false;
    },
    seller: {
      list: async (): Promise<Seller[]> => {
        const res = await execReq("GET", "/seller", {});
        return res?.sellers;
      },
      find: async (id: number): Promise<Seller> => {
        const res = await execReq("GET", `/seller/${id}`, {});
        return res?.seller;
      },
      delete: async (id: number): Promise<boolean> => {
        const res = await execReq("DELETE", `/seller/${id}`, {});
        return res?.succes;
      },
      create: async (
        username: string,
        password: string,
        role: "ADMIN" | "DEFAULT"
      ): Promise<Seller> => {
        const res = await execReq("POST", "/seller", {
          username,
          password,
          role,
        });
        return res?.seller;
      },
    },
  },
};

export default api;

fetchFromStorage();
