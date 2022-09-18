import SimpleOrder from "../../models/SimpleOrder";
import { PaginatedMeta } from "../../store/types";

export default interface OrdersResponse {
  meta: PaginatedMeta;
  list: Array<SimpleOrder>;
}
