import React from "react";

interface ImageViewModalProps {
  imageSrc?: string;
  altText?: string;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({
  imageSrc,
  altText,
}) => {
  return (
    <div className="w-full">
      <img
        src={imageSrc}
        alt={altText || "Image"}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageViewModal;
