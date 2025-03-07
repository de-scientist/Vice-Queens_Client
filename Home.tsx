import React from "react";
import Categories from "../components/Categories";
import Carousel from "../components/Carousel";
import { Input, Button } from "@heroui/react";
import { categories } from "../data/categories";
import LazyImage from "../components/LazyImage";
import SimilarProducts from "../components/SimilarProducts";

const Home: React.FC = () => {
  return (
    <main className="space-y-4">
      <div className="flex gap-4">
        <Categories />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-3xl text-white font-bold uppercase">
            <Carousel />
          </p>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group overflow-hidden rounded-lg"
            >
              <LazyImage
                src="https://img.freepik.com/premium-vector/realistic-wet-wipes-poster-sanitary-antibacterial-wipes-family-packaging-design-promotional-banner-cleansing-skincare-advertising-template-hygiene-accessory-utter-vector-concept_176411-8688.jpg?ga=GA1.1.786348031.1736697841&semt=ais_hybrid"
                alt="category thumbnail"
                height="64"
                width="full"
                classNames="transition-transform duration-300 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SimilarProducts title="Futured Products" />
      </section>

      <section>
        <div className="bg-primary rounded-2xl p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Vice Queen Community
          </h2>
          <p className="text-white mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            collections, exclusive offers, and fashion tips from our style
            experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input type="email" placeholder="Enter your email" radius="full" />
            <Button
              color="secondary"
              radius="full"
              className="font-semibold"
              variant="ghost"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
