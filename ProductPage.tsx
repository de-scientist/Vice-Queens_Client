import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  Card,
  CardHeader,
  Divider,
  Progress,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import {
  MdOutlineStarHalf,
  MdOutlineStarBorder,
  MdOutlineStar,
} from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiTruck, FiShield } from "react-icons/fi";
import ImageViewModal from "../components/ImageViewModal";
import SimilarProducts from "../components/SimilarProducts";
import { RootState } from "../store/store";
import {
  addQuantity,
  deleteQuantity,
  addToCart,
  checkout,
  getProductById,
} from "../services/useproducts";
import TruncatedText from "../components/TruncatedText";
import initiateToastAlert from "../utils/Toster";

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  stock: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  rating?: {
    rate: number;
  };
  reviews?: {
    count: number;
    starRating: number;
  };
}

const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const selectedProduct = useSelector(
    (state: RootState) => state.selectedProduct,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>("details");
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);

  useEffect(() => {
    if (!selectedProduct && productId) {
      // Fetch product if accessing directly via URL
      const fetchProduct = async () => {
        try {
          const data = await getProductById(productId);
          if (!data) {
            navigate("/all-products");
            return;
          }
          dispatch(setSelectedProduct(data));
        } catch (error) {
          console.error("Error fetching product:", error);
          navigate("/all-products");
        }
      };
      fetchProduct();
    }
  }, [productId, selectedProduct]);

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image);
    }
  }, [product]);

  const thumbnails = product?.images || [];

  const handleAddQuantity = async () => {
    if (!product?.stock) return;
    try {
      await addQuantity(product.id, 1);
      setQuantity(Math.min(product.stock, quantity + 1));
    } catch (error) {
      console.error("Error adding quantity:", error);
    }
  };
  const handleSubtractQuantity = async () => {
    if (quantity <= 1) return;
    try {
      await deleteQuantity(product.id, 1);
      setQuantity(Math.max(1, quantity - 1));
    } catch (error) {
      console.error("Error subtracting quantity:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!product) {
        throw new Error("Product not found");
      }
      await addToCart(product.id, quantity);
      initiateToastAlert(
        `${product?.name} added to cart successfully!`,
        "success",
      );
    } catch (error) {
      initiateToastAlert("Failed to add item to cart", "error");
      console.error("Error adding to cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!product) {
        throw new Error("Product not found");
      }

      const checkoutItem = {
        id: product.id,
        quantity: quantity,
      };
      await checkout([checkoutItem]);
      navigate("/order/payment");
    } catch (error) {
      initiateToastAlert("Failed to proceed to checkout", "error");
      console.error("Error during checkout:", error);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-4">Product not found</div>;
  }

  const discountPercentage =
    product?.previousPrice && product?.currentPrice
      ? Math.round(
          ((product.previousPrice - product.currentPrice) /
            product.previousPrice) *
            100,
        )
      : null;

  const reviewStars = [1, 2, 3, 4, 5];
  const reviews = 30;
  const reviewSummary = [
    { rating: 5, count: 20 },
    { rating: 4, count: 10 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ];

  const calculateStars = (rating: number) => {
    return reviewStars.map((_, index) => {
      if (rating >= index + 1) {
        return <MdOutlineStar key={index} />;
      } else if (rating > index && rating < index + 1) {
        return <MdOutlineStarHalf key={index} />;
      } else {
        return <MdOutlineStarBorder key={index} />;
      }
    });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedThumbnail(index);
    setSelectedImage(thumbnails[index]);
  };

  const handlePrevThumbnail = () => {
    setSelectedThumbnail((prev) =>
      prev > 0 ? prev - 1 : thumbnails.length - 1,
    );
    setSelectedImage(
      thumbnails[
        (selectedThumbnail - 1 + thumbnails.length) % thumbnails.length
      ],
    );
  };

  const handleNextThumbnail = () => {
    setSelectedThumbnail((prev) =>
      prev < thumbnails.length - 1 ? prev + 1 : 0,
    );
    setSelectedImage(thumbnails[(selectedThumbnail + 1) % thumbnails.length]);
  };

  const percentageStarRating = (count: number) => {
    return (count / reviews) * 100;
  };

  return (
    <main>
      <div className="min-h-screen w-screen bg-background">
        <Navbar />
        <div className="container mx-auto md:px-8 lg:px-16 xl:px-40">
          <Breadcrumbs size="sm" className="py-4">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/all-products">Products</BreadcrumbItem>
            <BreadcrumbItem>{product?.category || "Product"}</BreadcrumbItem>
            <BreadcrumbItem>{product?.name || "Tissue"}</BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-col md:flex-row md:space-x-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex-shrink-0  space-y-3">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="product image"
                  className="md:w-[30rem] md:h-[30rem] object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                <Button variant="flat" size="sm" onPress={handlePrevThumbnail}>
                  <FaArrowLeft />
                </Button>
              </div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                <Button variant="flat" size="sm" onPress={handleNextThumbnail}>
                  <FaArrowRight />
                </Button>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {thumbnails.map((thumbnail: string, index: number) => (
                  <img
                    key={index}
                    className={`w-16 h-16 border-2 cursor-pointer ${
                      selectedThumbnail === index ? "border-primary" : ""
                    }`}
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            </div>
            <div className="w-full md:flex-1 space-y-4">
              <h2 className="text-2xl font-bold">{product?.name}</h2>
              <TruncatedText
                text={product?.description}
                maxLength={250}
                classNames="text-gray-600"
              />
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-secondary">
                  {calculateStars(product?.rating?.rate ?? 0)}
                  <span className="text-sm font-medium text-secondary">
                    {product?.reviews?.starRating}
                  </span>
                </div>
                {product?.reviews && product.reviews.count >= 10 && (
                  <button
                    className="text-sm hover:text-primary hover:underline"
                    onClick={async () => {
                      await setSelectedTab("reviews");
                      reviewsRef.current?.scrollIntoView({
                        behavior: "smooth",
                      });
                    }}
                  >{`${product?.reviews?.count} reviews`}</button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-primary">
                  Ksh. {product?.currentPrice}
                </p>
                {product?.previousPrice && (
                  <p className="text-md text-gray-400 line-through">
                    Ksh. {product.previousPrice}
                  </p>
                )}
                {discountPercentage && (
                  <p className="text-sm font-medium text-red-600">
                    -{discountPercentage}%
                  </p>
                )}
              </div>
              <div>{/* size, color, quantity, etc. */}</div>
              <div className="flex items-center space-x-2">
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  radius="full"
                  onPress={handleSubtractQuantity}
                >
                  <FaMinus />
                </Button>
                <span>{quantity}</span>
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  radius="full"
                  onPress={handleAddQuantity}
                >
                  <FaPlus />
                </Button>
                <p className="text-xs text-red-700 ps-4">
                  {!product.stock
                    ? "Out of stock"
                    : product.stock < 10
                      ? "Only a few left"
                      : "In stock"}
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  color="primary"
                  radius="sm"
                  className="capitalize"
                  onPress={() => {
                    handleAddToCart();
                  }}
                >
                  add to cart
                </Button>
                <Button
                  color="secondary"
                  radius="sm"
                  className="capitalize"
                  onPress={() => {
                    handleCheckout();
                  }}
                >
                  buy now
                </Button>
              </div>
              <div className="text-xs flex flex-col gap-2">
                <div className="flex gap-2 items-center text-green-700">
                  <FiTruck />
                  <span>Free shipping on orders over $50!</span>
                </div>
                <div className="gap-2 flex items-center text-blue-700">
                  <FiShield />
                  <span>Secure checkout with buyer protection</span>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            className="my-4"
            aria-label="Tabs colors"
            color="primary"
            radius="full"
            variant="underlined"
            selectedKey={selectedTab}
          >
            //Continuation
            <Tab title="Details" key="details">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
                quam quibusdam cum. Laudantium distinctio quas ipsum sint quis
                ratione magni? Quibusdam totam excepturi illo. Quidem sit
                doloremque temporibus esse quia pariatur, nulla deleniti autem
                nobis iure non eos commodi consequuntur laboriosam aliquid
                obcaecati molestiae reprehenderit modi ad tenetur neque aliquam?
              </p>
            </Tab>
            <Tab title="Shipping" key="shipping">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatibus hic alias eligendi nesciunt quasi, eaque corporis
              perferendis, quo delectus aperiam, dignissimos eveniet dolores
              debitis dolore facere aliquid nobis deleniti deserunt.
            </Tab>
            <Tab title="Customer Reviews" key="reviews">
              <div ref={reviewsRef}>
                <Card radius="sm">
                  <CardHeader>
                    <h3 className="capitalize font-semibold">
                      customer review
                    </h3>
                  </CardHeader>
                  <Divider className="bg-background" />
                  <div className="p-4 md:p-0 md:flex">
                    <div className="md:p-4 space-y-2">
                      <h4 className="uppercase text-sm ">verified ratings</h4>
                      <div className="p-3 flex flex-col items-center justify-center bg-background rounded">
                        <p>
                          <span className="text-2xl text-secondary font-semibold">
                            {product?.reviews?.starRating}
                          </span>{" "}
                          / 5
                        </p>
                        <div className="flex items-center text-secondary">
                          {reviewStars.map((_, index) => {
                            return <MdOutlineStar key={index} />;
                          })}
                        </div>
                        <div>{`${reviews} verified ratings`}</div>
                      </div>
                      <div>
                        {reviewSummary.map((rating) => {
                          const ratingPercentage = percentageStarRating(
                            rating.count,
                          );
                          return (
                            <div className="flex space-x-4 items-center">
                              <p className="font-semibold">{rating.rating}</p>
                              <span className="text-md text-secondary">
                                <MdOutlineStar />
                              </span>
                              <p>{`(${rating.count})`}</p>
                              <Progress
                                size="md"
                                value={ratingPercentage}
                                color="secondary"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="md:flex-1 p-4 space-y-2">
                      <h4 className="uppercase text-sm">
                        What customers say about this product(12)
                      </h4>
                      <div className="space-y-2 max-h-[70vh] overflow-auto">
                        {reviewStars.map(() => (
                          <div className="space-y-1">
                            <p className="text-xs">
                              <span className="capitalize font-semibold text-medium">
                                joseph
                              </span>{" "}
                              on January 22, 2025:
                            </p>
                            <div className="flex items-center text-secondary">
                              {reviewStars.map((_, index) => {
                                return <MdOutlineStar key={index} />;
                              })}
                            </div>
                            <div
                              className="w-16 h-16 overflow-hidden cursor-pointer"
                              onClick={onOpen}
                            >
                              <img
                                src=""
                                alt="review image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Modal
                              isOpen={isOpen}
                              onOpenChange={onOpenChange}
                              size="xl"
                            >
                              <ModalContent>
                                <ModalHeader className="flex flex-col gap-1">
                                  Modal Title
                                </ModalHeader>
                                <ModalBody>
                                  <ImageViewModal
                                    imageSrc={product.images[0]}
                                    altText="review image"
                                  />
                                </ModalBody>
                              </ModalContent>
                            </Modal>
                            <p className="text-sm">
                              I loved this product so much
                            </p>
                            <Divider className="bg-background" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              {(product?.reviews?.count ?? 0) >= 10 && (
                <button
                  className="text-sm hover:text-primary hover:underline"
                  onClick={async () => {
                    await setSelectedTab("reviews");
                    reviewsRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >{`${product?.reviews?.count} reviews`}</button>
              )}
            </Tab>
          </Tabs>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold text-primary">
              Ksh {product?.currentPrice}
            </p>
            <p className="text-md text-gray-400 line-through">Ksh 150.00</p>
            <p className="text-sm font-medium text-red-600">-33%</p>
          </div>
          <div>{/* size, color, quantity, etc. */}</div>
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              radius="full"
              onPress={handleSubtractQuantity}
            >
              <FaMinus />
            </Button>
            <span>{quantity}</span>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              radius="full"
              onPress={handleAddQuantity}
            >
              <FaPlus />
            </Button>
            <p className="text-xs text-red-700 ps-4">
              {!product.stock
                ? "Out of stock"
                : product.stock < 10
                  ? "Only a few left"
                  : "In stock"}
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              color="primary"
              radius="sm"
              className="capitalize"
              onPress={() => {
                handleAddToCart();
              }}
            >
              add to cart
            </Button>
            <Button
              color="secondary"
              radius="sm"
              className="capitalize"
              onPress={() => {
                handleCheckout();
              }}
            >
              buy now
            </Button>
          </div>
          <div className="text-xs flex flex-col gap-2">
            <div className="flex gap-2 items-center text-green-700">
              <FiTruck />
              <span>Free shipping on orders over $50!</span>
            </div>
            <div className="gap-2 flex items-center text-blue-700">
              <FiShield />
              <span>Secure checkout with buyer protection</span>
            </div>
          </div>
        </div>
      </div>
      <Tabs
        className="my-4"
        aria-label="Tabs colors"
        color="primary"
        radius="full"
        variant="underlined"
        selectedKey={selectedTab}
      >
        <Tab title="Details" key="details">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quam
            quibusdam cum. Laudantium distinctio quas ipsum sint quis ratione
            magni? Quibusdam totam excepturi illo. Quidem sit doloremque
            temporibus esse quia pariatur, nulla deleniti autem nobis iure non
            eos commodi consequuntur laboriosam aliquid obcaecati molestiae
            reprehenderit modi ad tenetur neque aliquam?
          </p>
        </Tab>
        <Tab title="Shipping" key="shipping">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus
          hic alias eligendi nesciunt quasi, eaque corporis perferendis, quo
          delectus aperiam, dignissimos eveniet dolores debitis dolore facere
          aliquid nobis deleniti deserunt.
        </Tab>
        <Tab title="Customer Reviews" key="reviews">
          <div ref={reviewsRef}>
            <Card radius="sm">
              <CardHeader>
                <h3 className="capitalize font-semibold">customer review</h3>
              </CardHeader>
              <Divider className="bg-background" />
              <div className="p-4 md:p-0 md:flex">
                <div className="md:p-4 space-y-2">
                  <h4 className="uppercase text-sm ">verified ratings</h4>
                  <div className="p-3 flex flex-col items-center justify-center bg-background rounded">
                    <p>
                      <span className="text-2xl text-secondary font-semibold">
                        {product?.rating?.rate}
                      </span>{" "}
                      / 5
                    </p>
                    <div className="flex items-center text-secondary">
                      {reviewStars.map((_, index) => {
                        return <MdOutlineStar key={index} />;
                      })}
                    </div>
                    <div>{`${reviews} verified ratings`}</div>
                  </div>
                  <div>
                    {reviewSummary.map((rating) => {
                      const ratingPercentage = percentageStarRating(
                        rating.count,
                      );
                      return (
                        <div className="flex space-x-4 items-center">
                          <p className="font-semibold">{rating.rating}</p>
                          <span className="text-md text-secondary">
                            <MdOutlineStar />
                          </span>
                          <p>{`(${rating.count})`}</p>
                          <Progress
                            size="md"
                            value={ratingPercentage}
                            color="secondary"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="md:flex-1 p-4 space-y-2">
                  <h4 className="uppercase text-sm">
                    What customers say about this product(12)
                  </h4>
                  <div className="space-y-2 max-h-[70vh] overflow-auto">
                    {reviewStars.map(() => (
                      <div className="space-y-1">
                        <p className="text-xs">
                          <span className="capitalize font-semibold text-medium">
                            joseph
                          </span>{" "}
                          on January 22, 2025:
                        </p>
                        <div className="flex items-center text-secondary">
                          {reviewStars.map((_, index) => {
                            return <MdOutlineStar key={index} />;
                          })}
                        </div>
                        <div
                          className="w-16 h-16 overflow-hidden cursor-pointer"
                          onClick={onOpen}
                        >
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ii65rQjSvFJMD8FYbUVHH-8nl7Vc6d_20Q&s"
                            alt="review image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Modal
                          isOpen={isOpen}
                          onOpenChange={onOpenChange}
                          size="xl"
                        >
                          <ModalContent>
                            <ModalHeader className="flex flex-col gap-1">
                              Modal Title
                            </ModalHeader>
                            <ModalBody>
                              <ImageViewModal
                                imageSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ii65rQjSvFJMD8FYbUVHH-8nl7Vc6d_20Q&s"
                                altText="review image"
                              />
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                        <p className="text-sm">I loved this product so much</p>
                        <Divider className="bg-background" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Tab>
      </Tabs>
      <SimilarProducts title="similar products" />
      <div className="my-4 flex justify-center ">
        <Button variant="bordered" color="primary">
          Continue Shopping
        </Button>
      </div>
    </main>
  );
};

export default ProductPage;
