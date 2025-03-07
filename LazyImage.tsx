import React, { useState } from "react";
import { Skeleton } from "@heroui/react";

interface LazyImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  classNames?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  classNames,
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  return (
    <div className={`h-${height}  w-${width} flex justify-center`}>
      {!isLoaded && <Skeleton className="w-full h-full" isLoaded={isLoaded} />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${isLoaded ? "block" : "hidden"} object-cover w-full h-full ${classNames}`}
      />
    </div>
  );
};

export default LazyImage;
