"use client";

import React from "react";
import { Space, Typography, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import { usePost } from "@/app/hooks/usePost";
import CommentSection from "@/app/components/Comment";
import NotFound from "@/app/not-found";
import { formatDateTime } from "@/app/utils/formatDateTime";
import ImageComponentPostImage from "@/app/components/ImageComponentPostImage";
const { Title, Paragraph } = Typography;
import ImageComponentAvatar from "@/app/components/ImageComponentAvatar";

const PostDetail: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { useGetPostById } = usePost();
  const { data: post, isLoading } = useGetPostById(id as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post || !id) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ textAlign: "center" }}>
          <ImageComponentAvatar
            size={80}
            src={post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
            alt="User Avatar"
          />
          <Title level={4}>{post.user?.username || "Testing"}</Title>
          <Paragraph>
            <Space>
              <Tag
                bordered={false}
                color={"processing"}
                style={{ cursor: "pointer" }}
              >
                {post.category.name}
              </Tag>
              <span>
                <CalendarOutlined /> {formatDateTime(post.createdAt)}
              </span>
            </Space>
          </Paragraph>
        </div>

        <Title level={2} style={{ textAlign: "center" }}>
          {post.title}
        </Title>

        {post.image ? (
          <div style={{ textAlign: "center" }}>
            <ImageComponentPostImage src={post.image} alt="Post Image" />
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <img
              src="https://farm4.staticflickr.com/3224/3081748027_0ee3d59fea_z_d.jpg"
              alt="Default Image"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </div>
        )}

        <Paragraph style={{ whiteSpace: "pre-wrap" }}>{post.content}</Paragraph>

        {id && (
          <CommentSection
            postId={id}
            id={""}
            content={""}
            createdAt={""}
            updatedAt={""}
            user={{
              id: "",
              name: "",
            }}
            post={{
              id: "",
            }}
          />
        )}
      </Space>
    </div>
  );
};

export default PostDetail;
