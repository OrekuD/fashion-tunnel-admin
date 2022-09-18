import User from "../../models/User";
import { PaginatedMeta } from "../../store/types";

export default interface UsersResponse {
  meta: PaginatedMeta;
  list: Array<User>;
}
