"use client";

import React from "react";
import { Avatar, Space, Typography } from "antd";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { usePost } from "@/app/hooks/usePost";
import Comment from "@/app/components/Comment";
const { Title, Paragraph } = Typography;

const PostDetail = () => {
  const { id } = useParams();
  const { useGetPostById } = usePost();
  const { data: post, isLoading } = useGetPostById(id);

  const formatDateTime = (isoString: any) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <Avatar
            src="https://i.imgur.com/CzXTtJV.jpg"
            size={64}
            icon={<UserOutlined />}
            style={{ marginBottom: "10px" }}
          />
          <Title level={4}>{post.author}</Title>
          <Paragraph>
            <Space>
              <span>{post.category.name}</span>
              <span>
                <CalendarOutlined /> {formatDateTime(post.createdAt)}
              </span>
            </Space>
          </Paragraph>
        </div>

        <Title level={2} style={{ textAlign: "center" }}>
          {post.title}
        </Title>

        {post.image && (
          <div style={{ textAlign: "center" }}>
            <img
              src={
                post.image ||
                "https://farm6.staticflickr.com/5590/14821526429_5c6ea60405_z_d.jpg"
              }
              alt={post.title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        )}

        <Paragraph>{post.content}</Paragraph>

        <Comment postId={id} />
      </Space>
    </div>
  );
};

export default PostDetail;
