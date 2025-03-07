import React, { useState } from "react";
import { useFormik } from "formik";
import { array, number, object, string } from "yup";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FaMinus } from "react-icons/fa6";
import { LuArrowLeft, LuImagePlus } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useUpdateProduct } from "../../services/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCategories } from "../../services/category.service";
import axios from "axios";
import initiateToastAlert from "../../utils/Toster";

const EditProduct: React.FC = () => {
  const product = useSelector(
    (state: RootState) => state.editedProduct.product,
  );
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    product?.images || [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: updateProduct, isLoading: isUpdating } = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "ecommerce");
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
        );
        return response.data?.secure_url;
      } catch (error) {
        console.error("Upload error:", error);
        return null;
      }
    });

    try {
      const newUploadedUrls = (await Promise.all(uploadPromises)).filter(
        Boolean,
      );
      if (newUploadedUrls.length > 0) {
        const updatedImages = [...uploadedImages, ...newUploadedUrls];
        setUploadedImages(updatedImages);
        formik.setFieldValue("images", updatedImages);
        initiateToastAlert("Images uploaded successfully", "success");
      }
    } catch (error) {
      initiateToastAlert("Failed to upload images", "warning");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image handler
  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    formik.setFieldValue("images", updatedImages);
  };

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "",
      stock: product?.stock || 0,
      previousPrice: product?.currentPrice || 0,
      currentPrice: product?.currentPrice || 0,
      images: uploadedImages,
    },
    validationSchema: object({
      name: string().required("Product name is required"),
      category: string().required("Category is required"),
      description: string().required("Product description is required"),
      stock: number()
        .required("Stock is required")
        .min(0, "Stock cannot be negative"),
      images: array()
        .of(string().url("Invalid image URL"))
        .required("At least one image is required"),
      previousPrice: number().when("currentPrice", {
        is: (val: number) => val > 0,
        then: (schema) => schema.required("Previous price is required"),
        otherwise: (schema) => schema.optional(),
      }),
      currentPrice: number()
        .test(
          "price-check",
          "New price must be different from previous price",
          function (value) {
            return !isUpdatingPrice || value !== this.parent.previousPrice;
          },
        )
        .positive("Price must be positive"),
    }),
    onSubmit: async (values) => {
      if (uploadedImages.length === 0) {
        initiateToastAlert("At least one image is required", "error");
        return;
      }

      try {
        const updatedProduct = {
          ...values,
          images: uploadedImages,
          currentPrice: isUpdatingPrice
            ? values.currentPrice
            : values.previousPrice,
          previousPrice: isUpdatingPrice ? values.previousPrice : undefined,
        };

        await updateProduct({
          id: product?.id as string,
          updatedProduct,
        });

        initiateToastAlert("Product updated successfully", "success");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        navigate("/admin/products");
      } catch (error) {
        initiateToastAlert("Failed to update product", "warning");
      }
    },
  });

  const handlePriceUpdate = () => {
    setIsUpdatingPrice(!isUpdatingPrice);
    if (!isUpdatingPrice) {
      // When enabling price update, set current as previous
      formik.setFieldValue("previousPrice", formik.values.currentPrice);
      formik.setFieldValue("currentPrice", "");
    } else {
      // When disabling price update, restore original price
      formik.setFieldValue("currentPrice", formik.values.previousPrice);
      formik.setFieldValue("previousPrice", undefined);
    }
  };

  return (
    <div className="bg-white rounded-lg space-y-4 p-2">
      <div className="flex gap-4 items-center">
        <Button
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-xl"
          onPress={() => navigate("/admin/products")}
        >
          <LuArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <Input
          label="Name"
          name="name"
          variant="bordered"
          size="sm"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.name && Boolean(formik.errors.name)}
          errorMessage={formik.touched.name && formik.errors.name}
        />
        <Select
          label="Category"
          name="category"
          variant="bordered"
          size="sm"
          value={formik.values.category}
          onChange={formik.handleChange}
          isLoading={categoriesLoading}
          isInvalid={formik.touched.category && Boolean(formik.errors.category)}
          errorMessage={formik.touched.category && formik.errors.category}
        >
          {(categories || []).map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Product Price</h3>
            <Button
              variant="flat"
              color={isUpdatingPrice ? "danger" : "primary"}
              onPress={handlePriceUpdate}
              size="sm"
            >
              {isUpdatingPrice ? "Cancel Price Update" : "Update Price"}
            </Button>
          </div>

          {isUpdatingPrice ? (
            <>
              <Input
                label="Previous Price"
                name="previousPrice"
                type="number"
                variant="bordered"
                size="sm"
                value={(formik.values.previousPrice || 0).toString()}
                isReadOnly
                isDisabled
              />
              <Input
                label="New Price"
                name="currentPrice"
                type="number"
                variant="bordered"
                size="sm"
                value={(formik.values.currentPrice || 0).toString()}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.currentPrice &&
                  Boolean(formik.errors.currentPrice)
                }
                errorMessage={
                  formik.touched.currentPrice && formik.errors.currentPrice
                }
              />
            </>
          ) : (
            <Input
              label="Current Price"
              name="currentPrice"
              type="number"
              variant="bordered"
              size="sm"
              value={(formik.values.currentPrice || 0).toString()}
              isReadOnly
              isDisabled
            />
          )}
        </div>
        <Textarea
          label="Description"
          name="description"
          variant="bordered"
          size="sm"
          value={formik.values.description}
          onChange={formik.handleChange}
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          variant="bordered"
          size="sm"
          value={formik.values.stock.toString()}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.stock && Boolean(formik.errors.stock)}
          errorMessage={formik.errors.stock}
        />
        <Input
          label="Image URLs (comma separated)"
          name="image"
          variant="bordered"
          size="sm"
          value={formik.values.images[0]}
          onChange={(e) =>
            formik.setFieldValue(
              "image",
              e.target.value.split(",").map((url) => url.trim()),
            )
          }
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.images && Boolean(formik.errors.images)}
          errorMessage={formik.errors.images}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Product Images</label>
            <div className="flex items-center justify-between">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-2 text-primary hover:text-primary-dark"
              >
                <LuImagePlus size={20} />
                <span>{isUploading ? "Uploading..." : "Add More Images"}</span>
              </label>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Product ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaMinus size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="flat"
            color="danger"
            onPress={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={isUpdating || isUploading}
            isDisabled={
              !formik.isValid || isUploading || uploadedImages.length === 0
            }
          >
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
