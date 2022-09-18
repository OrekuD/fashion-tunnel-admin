import ProductCategories from "../../namespace/ProductCategories";
import ProductGender from "../../namespace/ProductGender";
import { SizeType } from "../../types";

export default interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  productQuantity: string;
  productCategory: ProductCategories.Status;
  gender: ProductGender.Status;
  extraInfo: Array<string>;
  sizeType: SizeType;
  images: Array<string>;
}
