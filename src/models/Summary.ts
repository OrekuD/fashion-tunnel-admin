import { Chart } from "../types";

export default interface Summary {
  income: number;
  customers: number;
  orders: number;
  products: number;
  chart: Array<Chart>;
}
