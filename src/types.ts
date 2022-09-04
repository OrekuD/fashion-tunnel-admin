import moment from "moment";
import OrderStatus from "./namespace/OrderStatus";
import ProductCategories from "./namespace/ProductCategories";
import ProductGender from "./namespace/ProductGender";

export type SizeType = "cloth" | "shoe";

export class DeviceTypes {
  static readonly ANDROID = "android";
  static readonly IOS = "ios";
  static readonly WEB = "web";
}

export interface OrderProduct {
  id: string;
  price: number;
  count: number;
  total: number;
}

export interface DetailedOrderProduct {
  count: number;
  total: number;
  id: string;
  name: string;
  description: string;
  price: number;
  productQuantity: number;
  extraInfo: string;
  gender: ProductGender.Status;
  productCategory: ProductCategories.Status;
  sizeType: SizeType;
  images: Array<string>;
}

export namespace Request {
  export enum Status {
    PENDING = "pending",
    BEFORE_FULFILLED = "before-fulfilled",
    FULFILLED = "fulfilled",
    BEFORE_REJECTED = "before-rejected",
    REJECTED = "rejected",
  }

  export interface Payload {
    [key: string]: string | number | boolean | object;
  }

  export interface Info {
    name: string;
    status: Status;
    message: string;
    payload: Payload;
  }

  export interface State {
    updatedAt: number;
    list: Array<Info>;
  }
}

export class Timing {
  public static now = () => moment().valueOf();
}

export interface OrderStatusTimeStamp {
  status: OrderStatus.Status;
  time: string;
}
