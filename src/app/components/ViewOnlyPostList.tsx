"use client";
import React, { useState } from "react";
import { List, Card, Typography, Space, Divider, Tag } from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";

const { Title, Text } = Typography;

export const ViewOnlyPostList: React.FC = () => {
  const router = useRouter();
  const { useGetPosts } = usePost();
  const { data: posts, isLoading } = useGetPosts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  const filteredPosts = posts?.filter((post: Post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      !selectedCategory || 
      post.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = filteredPosts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const handleCategoryClick = (e: React.MouseEvent, categoryId: string) => {
    e.stopPropagation();
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    
    <List
      style={{
        marginLeft: "40px",
        marginRight: "300px",
      }}
      loading={isLoading}
      dataSource={sortedPosts}
      pagination={{
        pageSize: 10,
        total: sortedPosts?.length,
        showSizeChanger: false,
        showTotal: (total) => `Total ${total} posts`,
        style: {
          textAlign: "right",
          marginBottom: "10px",
        },
      }}
      renderItem={(post: Post) => (
        <List.Item>
          <Card
            style={{
              cursor: "pointer",
              padding: "0px",
              width: "1500px",
            }}
            onClick={() => router.push(`/posts/${post.id}`)}
            extra={
              <Space size="small">
                <Tag 
                  bordered={false} 
                  color={selectedCategory === post.category.id ? "success" : "processing"}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleCategoryClick(e, post.category.id)}
                >
                  {post.category.name}
                </Tag>
                <Divider type="vertical" />
                <Text type="secondary">{formatDateTime(post.updatedAt)}</Text>
              </Space>
            }
          >
            <Title
              level={5}
              style={{
                margin: "0 0 5px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {post.title}
            </Title>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.5em",
                maxHeight: "3em"
              }}
            >
              {post.content}
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ViewOnlyPostList;