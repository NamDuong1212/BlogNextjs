"use client";
import React, { useState } from "react";
import { Space, Typography, Spin } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useLike } from "@/app/hooks/useLike";

const { Text } = Typography;

interface LikeSectionProps {
  postId: string;
}

const LikeSection: React.FC<LikeSectionProps> = ({ postId }) => {
  const { useGetLikeCount, useCheckLikeStatus, useLikePost, useUnlikePost } =
    useLike();

  const { data: likeCountData, isLoading: isCountLoading } =
    useGetLikeCount(postId);
  const { data: likeStatusData, isLoading: isStatusLoading } =
    useCheckLikeStatus(postId);

  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  const { mutate: likePost } = useLikePost();
  const { mutate: unlikePost } = useUnlikePost();

  const isLiked =
    optimisticLiked !== null ? optimisticLiked : likeStatusData?.status === 1;
  const likeCount =
    optimisticCount !== null ? optimisticCount : likeCountData?.likes || 0;

  const handleLikeToggle = () => {
    if (isLiked) {
      setOptimisticLiked(false);
      setOptimisticCount(Math.max(0, likeCount - 1));

      unlikePost(postId, {
        onError: () => {
          setOptimisticLiked(true);
          setOptimisticCount(likeCount);
        },
      });
    } else {
      setOptimisticLiked(true);
      setOptimisticCount(likeCount + 1);

      likePost(postId, {
        onError: () => {
          setOptimisticLiked(false);
          setOptimisticCount(Math.max(0, likeCount - 1));
        },
      });
    }
  };

  if (isCountLoading || isStatusLoading) {
    return (
      <Space>
        <Spin size="small" />
        <Text>Loading likes...</Text>
      </Space>
    );
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
    >
      <Space
        align="center"
        size="small"
        style={{ cursor: "pointer" }}
        onClick={handleLikeToggle}
      >
        {isLiked ? (
          <HeartFilled style={{ fontSize: "20px", color: "#f5222d" }} />
        ) : (
          <HeartOutlined style={{ fontSize: "20px", color: "#f5222d" }} />
        )}
        <Text>{likeCount} likes</Text>
      </Space>
    </div>
  );
};

export default LikeSection;
