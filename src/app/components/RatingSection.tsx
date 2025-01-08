import React, { useState, useEffect } from 'react';
import { useRating } from '../hooks/useRating';
import { Rate, Spin } from 'antd';

interface RatingSectionProps {
  postId: string;
  ratingId?: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({ postId, ratingId }) => {
  const [userRating, setUserRating] = useState<number>(0);
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

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Average Rating:</span>
        {isLoading ? (
          <Spin size="small" />
        ) : (
          <span className="text-lg font-bold">
            {averageRating?.toFixed(1) || 'No ratings'}
          </span>
        )}
      </div>

      <Rate
        allowHalf={false}
        value={userRating}
        onChange={handleRating}
        className="text-2xl"
      />
      {userRating > 0 && (
        <span className="text-sm text-gray-600">
          Your rating: {userRating} stars
        </span>
      )}
    </div>
  );
};

export default RatingSection;