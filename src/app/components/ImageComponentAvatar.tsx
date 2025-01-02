import React from "react";
import { Avatar } from "antd";

interface ImageComponentProps {
  src?: string;
  alt: string;
  size?: number;
}

const ImageComponentAvatar: React.FC<ImageComponentProps> = ({
  src,
  alt,
  size = 40,
}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultAvatar = "https://i.imgur.com/CzXTtJV.jpg";
  const imageUrl = src ? `${baseURL}${src}` : defaultAvatar;

  return (
    <Avatar
      src={imageUrl}
      alt={alt}
      size={size}
      shape="circle"
      style={{ border: "2px solid #ccc" }}
    />
  );
};

export default ImageComponentAvatar;
