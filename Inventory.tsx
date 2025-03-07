import React, { useCallback, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteProduct,
  useGetProducts,
} from "../../services/product.service";
import { useGetCategories } from "../../services/category.service";
import TruncatedText from "../../components/TruncatedText";
import LazyImage from "../../components/LazyImage";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setProduct } from "../../store/slices/editedProduct";
import ConfirmationModal from "../../components/ConfirmationModal";
import Spinner from "../../components/Spinner";
import initiateToastAlert from "../../utils/Toster";

interface Variant {
  variantName: string;
  variations: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  previousPrice?: number;
  category: string;
  stock: number;
  images: string[];
  variants?: Variant[];
}

const Inventory: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [productToDelete, setProductToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useGetProducts();
  const { data: categories } = useGetCategories();
  const deleteProductMutation = useDeleteProduct();

  const handleEditClick = (selectedProduct: Product) => {
    console.log(selectedProduct);
    dispatch(setProduct(selectedProduct));
    navigate(`/admin/products/edit`);
  };

  const getCategoryName = (categoryId: string) => {
    return categories?.find((cat) => cat.id === categoryId)?.name || categoryId;
  };

  const handleDeleteClick = (product: { id: string; name: string }) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutate(productToDelete.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
          initiateToastAlert("Product deleted successfully", "success");
          setProductToDelete(null);
        },
        onError: (error) => {
          initiateToastAlert(
            error instanceof Error ? error.message : "Failed to delete product",
            "warning",
          );
        },
      });
    } catch (error) {
      initiateToastAlert("Failed to delete product", "warning");
    }
  };

  const columns = [
    {
      key: "image",
      label: "THUMBNAIL",
    },
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "description",
      label: "DESCRIPTION",
    },
    {
      key: "category",
      label: "CATEGORY",
    },
    {
      key: "currentPrice",
      label: "CURRENT PRICE",
    },
    {
      key: "previousPrice",
      label: "PREVIOUS PRICE",
    },
    {
      key: "stock",
      label: "STOCK",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const renderCells = useCallback(
    (product: Product, columnKey: string) => {
      switch (columnKey) {
        case "image":
          return (
            <div className="rounded-md overflow-hidden">
              <LazyImage
                src={product.images[0]} // Use first image from array
                alt={`Thumbnail for ${product.name}`}
                height="12"
                width="12"
              />
            </div>
          );
        case "name":
        case "description":
          return (
            <div>
              <TruncatedText
                text={product[columnKey]}
                maxLength={35}
                classNames=""
              />
            </div>
          );
        case "category":
          return <p>{getCategoryName(product.category)}</p>;
        case "currentPrice":
          return <p>Ksh.{product.currentPrice.toLocaleString()}</p>;
        case "previousPrice":
          return product.previousPrice ? (
            <p>Ksh.{product.previousPrice.toLocaleString()}</p>
          ) : (
            <p>-</p>
          );
        case "stock":
          return <p>{product.stock}</p>;
        case "action":
          return (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                size="sm"
                color="primary"
                onPress={() => handleEditClick(product)}
              >
                <MdOutlineEdit />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                isDisabled={deleteProductMutation.isLoading}
                onPress={() =>
                  handleDeleteClick({
                    id: product.id,
                    name: product.name,
                  })
                }
              >
                <MdDeleteOutline />
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
    [categories, deleteProductMutation.isLoading],
  );

  const rowsPerPage = 15;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product: Product): boolean =>
      Object.values(product)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          variant="bordered"
          color="secondary"
          placeholder="Search products..."
          startContent={<CiSearch />}
          className="w-56"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          isClearable
          onClear={() => setSearchQuery("")}
        />
        <Button
          color="primary"
          onPress={() => navigate("/admin/products/add")}
          startContent={<FaPlus />}
        >
          Add Product
        </Button>
      </div>
      <Table
        aria-label="Example table with dynamic content"
        selectionMode="single"
        bottomContent={
          <div className="flex w-full justify-between items-center">
            <span className="text-small text-default-400">
              {filteredProducts.length} products found
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        {isLoading ? (
          <TableBody emptyContent={<Spinner size="md" color="secondary" />}>
            {[]}
          </TableBody>
        ) : paginatedProducts.length > 0 ? (
          <TableBody items={paginatedProducts}>
            {(item) => (
              <TableRow>
                {(columnKey) => (
                  <TableCell>{renderCells(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No products match your search"}>
            {[]}
          </TableBody>
        )}
      </Table>
      <ConfirmationModal
        title="Delete Product"
        description={`Are you sure you want to delete ${productToDelete?.name}? This action cannot be undone.`}
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteProductMutation.isLoading}
        disabled={deleteProductMutation.isLoading}
      />
    </div>
  );
};

export default Inventory;
