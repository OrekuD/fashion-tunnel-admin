import moment from "moment";

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
