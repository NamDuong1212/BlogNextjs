"use client";

import React, { useState, useEffect } from "react";
import { Space, Button, Tooltip, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useLike } from "@/app/hooks/useLike";
import { LikeSectionState } from "../types/like";

const LikeSection: React.FC<LikeSectionState> = ({ postId }) => {
  const { useGetLikeCount, useLikePost, useUnlikePost } = useLike();

  const { data } = useGetLikeCount(postId);

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: unlikePost, isPending: isUnliking } = useUnlikePost();

  useEffect(() => {
    if (data?.likes !== undefined) {
      setLikeCount(data.likes);
    }
  }, [data]);

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikePost(postId, {
        onSuccess: () => {
          setIsLiked(false);
          setLikeCount((prev: number) => Math.max(prev - 1, 0));
          message.success("You unliked this post.");
        },
        onError: () => {
          message.error("Failed to unlike the post.");
        },
      });
    } else {
      likePost(postId, {
        onSuccess: () => {
          setIsLiked(true);
          setLikeCount((prev: number) => prev + 1);
          message.success("You liked this post.");
        },
        onError: () => {
          message.error("Failed to like the post.");
        },
      });
    }
  };

  return (
    <Space direction="vertical" align="center" style={{ width: "100%" }}>
      <Tooltip title={isLiked ? "Unlike" : "Like"}>
        <Button
          type="text"
          icon={
            isLiked ? (
              <HeartFilled style={{ color: "#ff4d4f" }} />
            ) : (
              <HeartOutlined />
            )
          }
          onClick={handleLikeToggle}
          loading={isLiking || isUnliking}
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              marginLeft: "4px",
              color: isLiked ? "#ff4d4f" : "inherit",
            }}
          >
            {likeCount} {likeCount === 1 ? "Like" : "Likes"}
          </span>
        </Button>
      </Tooltip>
    </Space>
  );
};

export default LikeSection;
