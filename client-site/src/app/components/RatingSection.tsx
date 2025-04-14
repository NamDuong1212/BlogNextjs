import React, { useState, useEffect } from 'react';
import { useRating } from '../hooks/useRating';
import { Rate, Spin } from 'antd';

interface RatingSectionProps {
  postId: string;
  ratingId?: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({ postId, ratingId }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const { useGetAverageRating, useGetRatingById, useCreateRating } = useRating(postId);
  const { data: averageRating, isLoading: isLoadingAverage } = useGetAverageRating();
  const { data: ratingData, isLoading: isLoadingRating } = useGetRatingById(ratingId || '');
  const { mutate: createRating } = useCreateRating();

  useEffect(() => {

    if (ratingData) {
      setUserRating(ratingData.stars);
    }
  }, [ratingData]);

  const handleRating = (stars: number) => {
    createRating(stars);
    setUserRating(stars);
  };

  const isLoading = isLoadingAverage || isLoadingRating;
  

  const displayValue = userRating !== null ? userRating : (averageRating || 0);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center">
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <>
            <Rate 
              value={displayValue} 
              onChange={handleRating} 
              allowHalf={false}
            />
            <span className="ml-2 text-sm text-gray-500">
              {userRating !== null 
                ? `Đánh giá của bạn: ${userRating} sao` 
                : averageRating 
                  ? `${averageRating.toFixed(1)}` 
                  : 'Chưa có đánh giá nào'}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default RatingSection;