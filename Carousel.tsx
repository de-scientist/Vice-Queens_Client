import React from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Carousel: React.FC = () => {
  const carouselImages = [
    "https://img.freepik.com/free-vector/flat-winter-sale-instagram-posts-collection_23-2149141572.jpg?ga=GA1.1.786348031.1736697841&semt=ais_incoming",
    "https://img.freepik.com/free-psd/bold-geometrics-social-media-post_23-2148909468.jpg?ga=GA1.1.786348031.1736697841&semt=ais_incoming",
    "https://img.freepik.com/premium-vector/fresh-tissue-social-media-post-instagram-banner-post-design-template_1040650-3773.jpg?ga=GA1.1.786348031.1736697841&semt=ais_incoming",
  ];

  return (
    <ResponsiveCarousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false} // Hide status text (prevents <p> nesting issues)
      className="h-[50vh] overflow-hidden rounded-lg"
    >
      {carouselImages.map((image, index) => (
        <div key={index} className="h-[50vh] flex items-center justify-center">
          {/* Wrapped inside a figure to avoid default <p> wrapping issues */}
          <figure className="w-full h-full">
            <img src={image} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
          </figure>
        </div>
      ))}
    </ResponsiveCarousel>
  );
};

export default Carousel;
