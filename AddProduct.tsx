import React, { useState } from "react";
import { useFormik } from "formik";
import { array, number, object, string } from "yup";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { FaMinus } from "react-icons/fa6";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCreateProduct } from "../../services/product.service";
import { useGetCategories } from "../../services/category.service";
import initiateToastAlert from "../../utils/Toster";

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const createProduct = useCreateProduct(selectedCategory);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validationSchema = object({
    name: string().required("Product name is required"),
    currentPrice: number().required("Product price is required").positive(),
    previousPrice: number().optional().positive(),
    category: string().required("Category is required"),
    description: string().required("Product description is required"),
    stock: number().required("Stock is required").min(0),
    images: array().of(string().url("Invalid image URL")),
  });

  const handleAddProductFrom = useFormik({
    initialValues: {
      name: "",
      currentPrice: "",
      previousPrice: "",
      category: "",
      description: "",
      stock: "",
      images: [] as string[],
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!selectedCategory) {
        initiateToastAlert("Please select a category", "error");
        return;
      }

      try {
        await createProduct.mutateAsync({
          ...values,
          currentPrice: Number(values.currentPrice),
          previousPrice: values.previousPrice
            ? Number(values.previousPrice)
            : undefined,
          stock: Number(values.stock),
          images: uploadedImages,
          category: selectedCategory,
        });

        initiateToastAlert("Product added successfully", "success");
        navigate("/admin/products");
      } catch (error) {
        initiateToastAlert(
          error instanceof Error ? error.message : "Error adding product",
          "warning",
        );
      }
    },
  });

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
      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean);
      if (uploadedUrls.length > 0) {
        setUploadedImages((prev) => [...prev, ...uploadedUrls]);
        handleAddProductFrom.setFieldValue("images", [
          ...uploadedImages,
          ...uploadedUrls,
        ]);
        initiateToastAlert("Images uploaded successfully", "success");
      }
    } catch (error: any) {
      initiateToastAlert("Failed to process image uploads", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    handleAddProductFrom.setFieldValue("images", newImages);
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
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
      </div>
      <div>
        <form
          className="space-y-4"
          onSubmit={handleAddProductFrom.handleSubmit}
        >
          <Input
            label="Name"
            variant="bordered"
            size="sm"
            name="name"
            value={handleAddProductFrom.values.name}
            onChange={handleAddProductFrom.handleChange}
            onBlur={handleAddProductFrom.handleBlur}
            isInvalid={
              handleAddProductFrom.touched.name &&
              Boolean(handleAddProductFrom.errors.name)
            }
            errorMessage={handleAddProductFrom.errors.name}
          />

          <Select
            label="Choose product category"
            variant="bordered"
            size="sm"
            name="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleAddProductFrom.setFieldValue("category", e.target.value);
            }}
            isLoading={categoriesLoading}
            isInvalid={
              handleAddProductFrom.touched.category &&
              Boolean(handleAddProductFrom.errors.category)
            }
            errorMessage={handleAddProductFrom.errors.category}
          >
            {(categories || []).map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </Select>

          <div className="flex gap-4 items-center">
            <Input
              label="Current Price"
              variant="bordered"
              size="sm"
              type="number"
              name="currentPrice"
              value={handleAddProductFrom.values.currentPrice}
              onChange={handleAddProductFrom.handleChange}
              onBlur={handleAddProductFrom.handleBlur}
              isInvalid={
                handleAddProductFrom.touched.currentPrice &&
                Boolean(handleAddProductFrom.errors.currentPrice)
              }
              errorMessage={handleAddProductFrom.errors.currentPrice}
            />

            <Input
              label="Previous Price"
              variant="bordered"
              size="sm"
              type="number"
              name="previousPrice"
              value={handleAddProductFrom.values.previousPrice}
              onChange={handleAddProductFrom.handleChange}
              onBlur={handleAddProductFrom.handleBlur}
              isInvalid={
                handleAddProductFrom.touched.previousPrice &&
                Boolean(handleAddProductFrom.errors.previousPrice)
              }
              errorMessage={handleAddProductFrom.errors.previousPrice}
            />
          </div>

          <Textarea
            label="Description"
            variant="bordered"
            size="sm"
            name="description"
            value={handleAddProductFrom.values.description}
            onChange={handleAddProductFrom.handleChange}
            onBlur={handleAddProductFrom.handleBlur}
            isInvalid={
              handleAddProductFrom.touched.description &&
              Boolean(handleAddProductFrom.errors.description)
            }
            errorMessage={handleAddProductFrom.errors.description}
          />

          <Input
            label="Stock"
            variant="bordered"
            size="sm"
            type="number"
            name="stock"
            value={handleAddProductFrom.values.stock}
            onChange={handleAddProductFrom.handleChange}
            onBlur={handleAddProductFrom.handleBlur}
            isInvalid={
              handleAddProductFrom.touched.stock &&
              Boolean(handleAddProductFrom.errors.stock)
            }
            errorMessage={handleAddProductFrom.errors.stock}
          />

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Product Images</label>
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
                className="cursor-pointer border-2 border-dashed p-4 rounded-lg text-center"
              >
                {isUploading ? "Uploading..." : "Click to upload images"}
              </label>

              <div className="grid grid-cols-4 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <FaMinus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              isLoading={createProduct.isPending || isUploading}
              isDisabled={
                !handleAddProductFrom.isValid ||
                isUploading ||
                !selectedCategory
              }
            >
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
