import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextInput } from "../../components";
import Dropdown from "../../components/Dropdown";
import { PlusIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import ProductCategories from "../../namespace/ProductCategories";
import ProductGender from "../../namespace/ProductGender";
import CreateProductRequest from "../../network/requests/CreateProductRequest";
import productsAsyncActions from "../../store/actions/products.action";
import uploadAsyncActions from "../../store/actions/upload.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { SizeType } from "../../types";
import isAnyEmpty from "../../utils/isAnyEmpty";
import toNumber from "../../utils/toNumber";
import classes from "./index.module.scss";

const EditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { request, upload, product } = useSelectState();

  const [isFetching, setIsFetching] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [gender, setGender] = React.useState<ProductGender.Status>(
    ProductGender.Status.UNISEX
  );
  const [productCategory, setProductCategory] =
    React.useState<ProductCategories.Status>();
  const [sizeType, setSizeType] = React.useState<SizeType>();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [productQuantity, setProductQuantity] = React.useState("");
  const [extraInfo, setExtraInfo] = React.useState<Array<string>>([]);
  const [description, setDescription] = React.useState("");
  const [showGenderDropdown, setShowGenderDropdown] = React.useState(false);
  const [showSizeTypeDropdown, setShowSizeTypeDropdown] = React.useState(false);
  const [showProductCategoryDropdown, setShowProductCategoryDropdown] =
    React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.updateProduct.typePrefix)) {
      RM.consume(productsAsyncActions.updateProduct.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.updateProduct.typePrefix)) {
      RM.consume(productsAsyncActions.updateProduct.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isFulfilled(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      if (product?.product) {
        setGender(product.product.gender);
        setProductCategory(product.product.productCategory);
        setSizeType(product.product.sizeType);
        setPrice(product.product.price.toString());
        setName(product.product.name);
        setProductQuantity(product.product.productQuantity.toString());
        setExtraInfo(product.product.extraInfo);
        setDescription(product.product.description);
      }
      setIsFetching(false);
      return;
    }

    if (RM.isRejected(productsAsyncActions.getProduct.typePrefix)) {
      RM.consume(productsAsyncActions.getProduct.typePrefix);
      setIsFetching(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  React.useEffect(() => {
    if (!productId) return;
    dispatch(productsAsyncActions.getProduct(productId));
  }, [productId]);

  const canProceed = React.useMemo(() => {
    if (typeof productCategory === undefined || typeof sizeType === undefined) {
      return false;
    }
    return !isAnyEmpty([name, price, productQuantity]);
  }, [
    name,
    price,
    productQuantity,
    productCategory,
    sizeType,
    // extraInfo,
  ]);

  const sizeTypes: Array<SizeType> = React.useMemo(() => ["cloth", "shoe"], []);

  if (isFetching) return <p>Fetching ....</p>;

  if (!product?.product?.id) return <p>No product found bro ....</p>;

  const handleSubmit = async () => {
    if (!canProceed || isLoading || !product.product) {
      return;
    }
    setIsLoading(true);

    dispatch(
      productsAsyncActions.updateProduct({
        id: product.product.id,
        description,
        extraInfo,
        gender,
        name,
        price: toNumber(price),
        productCategory: productCategory!,
        productQuantity,
        sizeType: sizeType!,
      })
    );
  };

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Edit product</p>
      <div className={classes["content"]}>
        <div className={classes["row"]}>
          {product.product.images.map((url) => (
            <img
              src={url}
              key={url}
              alt="preview-product-image"
              className={classes["preview-product-image"]}
            />
          ))}
        </div>
        <div className={classes["inputs"]}>
          <TextInput
            value={name}
            label="Product name"
            onChange={setName}
            placeholder="Product name"
          />
          <TextInput
            value={price}
            label="Product price"
            onChange={setPrice}
            placeholder="Product price"
          />
          <TextInput
            value={productQuantity}
            label="Product quantity"
            onChange={setProductQuantity}
            placeholder="Product quantity"
          />

          <Dropdown
            isVisible={showGenderDropdown}
            setIsVisible={setShowGenderDropdown}
            options={ProductGender.State.list().map((gender) =>
              ProductGender.State.text(gender)
            )}
            value={ProductGender.State.text(gender)}
            label="Choose gender"
            onChange={(text) => {
              setGender(ProductGender.State.getId(text));
              setShowGenderDropdown(false);
            }}
            placeholder="Select product gender"
          />
          <Dropdown
            isVisible={showSizeTypeDropdown}
            setIsVisible={setShowSizeTypeDropdown}
            options={sizeTypes}
            value={sizeType || ""}
            label="Choose size type"
            onChange={(text) => {
              setSizeType(text as SizeType);
              setShowSizeTypeDropdown(false);
            }}
            placeholder="Select size type"
          />
          <Dropdown
            isVisible={showProductCategoryDropdown}
            setIsVisible={setShowProductCategoryDropdown}
            options={ProductCategories.State.list().map((category) =>
              ProductCategories.State.text(category)
            )}
            value={
              typeof productCategory === undefined
                ? ""
                : ProductCategories.State.text(productCategory!)
            }
            label="Choose product category"
            onChange={(text) => {
              setProductCategory(ProductCategories.State.getId(text));
              setShowProductCategoryDropdown(false);
            }}
            placeholder="Select product category"
          />
          <TextInput
            value={description}
            textArea
            label="Product description"
            onChange={(text) => {
              setDescription(text);
            }}
            placeholder="Product description"
          />
        </div>
      </div>
      <Button
        label="Update"
        onClick={handleSubmit}
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EditProductPage;
