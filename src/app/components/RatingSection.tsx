import React from 'react';
import { useRating } from '../hooks/useRating';
import { Rate, Spin } from 'antd';

interface RatingSectionProps {
  postId: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({ postId }) => {
  const { useGetAverageRating, useCreateRating } = useRating(postId);
  const { data: averageRating, isLoading } = useGetAverageRating();
  const { mutate: createRating } = useCreateRating();

  const handleRating = (stars: number) => {
    createRating(stars);
  };

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
        onChange={handleRating}
        className="text-2xl"
      />
    </div>
  );
};

export default RatingSection;