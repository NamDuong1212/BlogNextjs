import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface ImageComponentProps {
  src?: string;
  images?: string[];
  alt?: string;
  width?: string;
  height?: string;
}

const ImageComponentPostImage: React.FC<ImageComponentProps> = ({
  src,
  images = [],
  alt = "Post Image",
  width = "100%",
  height = "400px"
}) => {
  // Combine src and images, prioritizing images array
  const allImages = images.length > 0 
    ? images 
    : (src ? [src] : []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const defaultImage = "https://i.imgur.com/CzXTtJV.jpg";

  // Determine image URLs, handling both absolute and relative paths
  const imageUrls = (allImages.length > 0 ? allImages : [defaultImage]).map(imgSrc =>
    imgSrc ? (imgSrc.startsWith('http') ? imgSrc : `${baseURL}${imgSrc}`) : defaultImage
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % imageUrls.length
    );
  };

  // Only show navigation if more than one image
  const showNavigation = imageUrls.length > 1;

  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main Image */}
      <img
        src={imageUrls[currentImageIndex]}
        alt={`${alt} ${currentImageIndex + 1}`}
        {...(!imageUrls[currentImageIndex].startsWith('http') && { crossOrigin: "anonymous" })}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      {/* Image Count Indicator */}
      {showNavigation && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full"
          style={{
            zIndex: 10,
          }}
        >
          {currentImageIndex + 1} / {imageUrls.length}
        </div>
      )}

      {/* Previous Image Button */}
      {showNavigation && (
        <button
          onClick={handlePrevImage}
          title="Previous Image"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 
            bg-black/50 text-white rounded-full p-2 
            hover:bg-black/70 transition-all duration-300 z-10"
        >
          <LeftOutlined />
        </button>
      )}

      {/* Next Image Button */}
      {showNavigation && (
        <button
          onClick={handleNextImage}
          title="Next Image"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 
            bg-black/50 text-white rounded-full p-2 
            hover:bg-black/70 transition-all duration-300 z-10"
        >
          <RightOutlined />
        </button>
      )}
    </div>
  );
};

export default ImageComponentPostImage;