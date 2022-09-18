import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

const CreateProductPage = () => {
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
  const [productImages, setProductImages] = React.useState<FileList>();
  const [productImage, setProductImage] = React.useState<File>();
  const [showGenderDropdown, setShowGenderDropdown] = React.useState(false);
  const [showSizeTypeDropdown, setShowSizeTypeDropdown] = React.useState(false);
  const [showProductCategoryDropdown, setShowProductCategoryDropdown] =
    React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { request, upload } = useSelectState();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(productsAsyncActions.createProduct.typePrefix)) {
      RM.consume(productsAsyncActions.createProduct.typePrefix);
      setIsLoading(false);
      setGender(ProductGender.Status.UNISEX);
      setProductCategory(undefined);
      setSizeType(undefined);
      setPrice("");
      setName("");
      setProductQuantity("");
      setExtraInfo([]);
      setDescription("");
      setProductImage(undefined);
      setProductImages(undefined);
      navigate(-1);
      return;
    }

    if (RM.isRejected(productsAsyncActions.createProduct.typePrefix)) {
      RM.consume(productsAsyncActions.createProduct.typePrefix);
      setIsLoading(false);
      return;
    }
    if (RM.isFulfilled(uploadAsyncActions.index.typePrefix)) {
      RM.consume(uploadAsyncActions.index.typePrefix);
      setIsUploading(false);

      const payload: CreateProductRequest = {
        description,
        extraInfo,
        gender,
        images: upload.images,
        name,
        price: toNumber(price),
        productCategory: productCategory!,
        productQuantity,
        sizeType: sizeType!,
      };
      dispatch(productsAsyncActions.createProduct(payload));
      return;
    }

    if (RM.isRejected(uploadAsyncActions.index.typePrefix)) {
      RM.consume(uploadAsyncActions.index.typePrefix);
      setIsUploading(false);
      setIsLoading(false);

      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    if (
      typeof productCategory === undefined ||
      typeof sizeType === undefined ||
      !productImage ||
      // extraInfo.length === 0 ||
      !productImages
    ) {
      return false;
    }
    return !isAnyEmpty([name, price, productQuantity]);
  }, [
    name,
    price,
    productQuantity,
    productCategory,
    sizeType,
    productImage,
    // extraInfo,
    productImages,
  ]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading || isUploading) {
      return;
    }
    setIsUploading(true);
    setIsLoading(true);
    if (!productImage || !productImages) {
      return;
    }
    const images = [productImage, ...Array.from(productImages)];

    const formData = new FormData();
    for (const image of images) {
      formData.append("images", image!);
    }

    dispatch(uploadAsyncActions.index(formData));
  };

  const previewProductImage = React.useMemo(() => {
    if (!productImage) return null;
    return URL.createObjectURL(productImage);
  }, [productImage]);

  const previewProductImages = React.useMemo(() => {
    if (!productImages) return [];

    return Array.from(productImages).map((productImage) =>
      URL.createObjectURL(productImage)
    );
    // return URL.createObjectURL(productImage);
  }, [productImages]);

  const sizeTypes: Array<SizeType> = React.useMemo(() => ["cloth", "shoe"], []);

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Add new product</p>
      <div className={classes["content"]}>
        <div className={classes["upload-section"]}>
          <div className={classes["row"]}>
            <label htmlFor="product-image">
              <div className={classes["upload-button"]}>
                <PlusIcon width={24} height={24} color={colors.darkgrey} />
              </div>
              <p className={classes["label"]}>Main image</p>
            </label>
            <input
              type="file"
              id="product-image"
              accept="image/png, image/gif, image/jpeg, image/webp"
              maxLength={1}
              className={classes["upload-file"]}
              onChange={(e) => {
                if (e.target?.files) {
                  setProductImage(e.target.files[0]);
                }
              }}
            />
          </div>
          {previewProductImage && (
            <img
              src={previewProductImage}
              alt="preview-product-image"
              className={classes["preview-product-image"]}
            />
          )}
          <div className={classes["row"]} style={{ marginTop: 24 }}>
            <label htmlFor="product-images">
              <div className={classes["upload-button"]}>
                <PlusIcon width={24} height={24} color={colors.darkgrey} />
              </div>
              <p className={classes["label"]}>Other images</p>
            </label>
            <input
              type="file"
              id="product-images"
              accept="image/png, image/gif, image/jpeg, image/webp"
              className={classes["upload-file"]}
              multiple
              onChange={(e) => {
                if (e.target?.files) {
                  setProductImages(e.target.files);
                }
              }}
            />
          </div>
          {previewProductImages.length > 0 && (
            <>
              {previewProductImages.map((file) => (
                <img
                  src={file}
                  key={file}
                  alt="preview-product-image"
                  className={classes["preview-product-image"]}
                />
              ))}
            </>
          )}
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
        label="create"
        onClick={handleSubmit}
        isDisabled={!canProceed || isLoading || isUploading}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateProductPage;
