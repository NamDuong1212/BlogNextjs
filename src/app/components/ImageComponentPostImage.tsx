import React from "react";

interface ImageComponentProps {
  src?: string;
  alt: string;
}

const ImageComponentPostImage: React.FC<ImageComponentProps> = ({
  src,
  alt,
}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultImage = "https://i.imgur.com/CzXTtJV.jpg";
  const imageUrl = src ? `${baseURL}${src}` : defaultImage;

  return (
    <img
      src={imageUrl}
      alt={alt}
      style={{
        width: "100%",
        borderRadius: "8px",
      }}
    />
  );
};

export default ImageComponentPostImage;
