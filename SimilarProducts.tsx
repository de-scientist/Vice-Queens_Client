import React from "react";
import { Link } from "react-router-dom";
import { similarProducts } from "../data/similarProducts";
import LazyImage from "./LazyImage";

interface AdditionProductProps {
  title: string;
}
const SimilarProducts: React.FC<AdditionProductProps> = ({ title }) => {
  return (
    <div className="p-2 bg-white shadow rounded-lg">
      <h3 className="capitalize font-semibold">{title}</h3>
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {similarProducts.map((product) => (
          <Link
            to={"#"}
            key={product.id}
            className="flex flex-col items-center gap-2 p-2 hover:shadow-lg"
          >
            <div className="w-full aspect-square overflow-hidde">
              <LazyImage
                src={product.imageUrl}
                alt={product.name}
                width="full"
                height="full"
              />
            </div>
            <div className="flex-1">
              <h4 className="capitalize font-semibold">{product.name}</h4>
              <p>{`Ksh ${product.price}`}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
