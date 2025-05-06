import React from "react";

interface ImageComponentProps {
  src?: string;
  alt: string;
  width?: string;
  height?: string;
}

const ImageComponentPostImage: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = "100%",
  height = "400px"
}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultImage = "https://i.imgur.com/CzXTtJV.jpg";
  
  // Kiểm tra nếu src là URL Cloudinary (thường bắt đầu bằng https://res.cloudinary.com/)
  // hoặc là đường dẫn local cần thêm baseURL
  const imageUrl = src 
    ? (src.startsWith('http') ? src : `${baseURL}${src}`) 
    : defaultImage;

  return (
    <div style={{
      width: width,
      height: height,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <img
        src={imageUrl}
        alt={alt}
        // Không cần crossOrigin cho Cloudinary URLs
        {...(!src?.startsWith('http') && { crossOrigin: "anonymous" })}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default ImageComponentPostImage;