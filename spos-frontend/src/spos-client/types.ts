
export type Product = {
    id: number,
    name: string,
    timestamp: Date,
    initial_value: number,
    minimum_value: number,
    price_points: PricePoint[],
    transactions: Transaction[]
}

export type PricePoint = {
    id: number,
    timestamp: Date,
    value: number,
    transactions: Transaction[],
    product: Product,
}

export type ItemExpanded = {
    product: Product,
    price_point: PricePoint,
    quantity: number,
}

export type ItemShallow = {
    product_id: number,
    price_point_id: number,
    quantity: number,
}

export type Interval = {
    seconds: number,
    minutes: number,
    hours: number,
    days: number,
    months: number,
}

export type Item = ItemExpanded | ItemShallow

export type Transaction = {
    id: number,
    timestamp: Date,
    seller: Seller[],
    items: Item[]
}

export enum SellerRole {
    UNKNOWN = "UNKNOWN",
    DEFAULT = "DEFAULT",
    ADMIN = "ADMIN"
}

export type Seller = {
    id: number,
    username: string,
    transactions: Transaction[],
    role: SellerRole
}

export type AuthData = {
    token: string
    user: Seller
} 

export type Subscriber = {
    id: string,
    code: string,
    events: string[],
    objects: string[]
}


export type CronJobData = {
    id: string;
    event: string;
    interval: string;
    status: boolean;
}


