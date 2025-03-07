import React from "react";

interface TruncatedTextProps {
  text: string;
  maxLength: number;
  classNames: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  classNames,
}) => {
  const isTruncated = text?.length > maxLength;

  return (
    <p className={` ${classNames}`}>
      {isTruncated ? `${text.slice(0, maxLength)}...` : text}
    </p>
  );
};

export default TruncatedText;
