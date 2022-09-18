import Product from "../../models/Product";
import { PaginatedMeta } from "../../store/types";

export default interface ProductsResponse {
  meta: PaginatedMeta;
  list: Array<Product>;
}
