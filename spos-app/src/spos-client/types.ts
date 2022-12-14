export type Product = {
  id: number;
  name: string;
  timestamp: Date;
  initial_value: number;
  minimum_value: number;
  price_points: PricePoint[];
  transactions: Transaction[];
};

export type PricePoint = {
  id: number;
  timestamp: Date;
  value: number;
  transactions: Transaction[];
  product: Product;
};

export type ItemExpanded = {
  product: Product;
  price_point: PricePoint;
  quantity: number;
};

export type ItemShallow = {
  product_id: number;
  price_point_id: number;
  quantity: number;
};

export function xMinute(interval: number): Interval {
  return {
    seconds: "0",
    minutes: `${interval}`,
    hours: "*",
    days: "*",
    months: "*",
  };
}

export function toInterval(str: string): Interval {
  const [seconds, minutes, hours, days, months] = str.replace("*/","").split(" ");
  return {
    seconds,
    minutes,
    hours,
    days,
    months,
  };
}

export type Interval = {
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  months: string;
};

export type Item = ItemExpanded | ItemShallow;

export type Transaction = {
  id: number;
  timestamp: Date;
  seller: Seller;
  items: ItemExpanded[];
};

export enum SellerRole {
  UNKNOWN = "UNKNOWN",
  DEFAULT = "DEFAULT",
  ADMIN = "ADMIN",
}

export type Seller = {
  id: number;
  username: string;
  transactions: Transaction[];
  role: SellerRole;
};

export type AuthData = {
  token: string;
  user: Seller;
};

export type Subscriber = {
  id: string;
  code: string;
  events: string[];
  objects: string[];
};

export type CronJobData = {
  id: string;
  event: string;
  interval: string;
  status: boolean;
  next: string;
};


export type ValidationEvent = {
  success: boolean;
  message: string;
};