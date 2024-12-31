"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Popconfirm,
  Space,
  Typography,
  Divider,
  Tag,
} from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import EditPostForm from "../components/EditPostForm";
import { formatDateTime } from "../utils/formatDateTime";
import useAuthStore from "../store/useAuthStore";

const { Text, Title } = Typography;

export const PostList = () => {
  const router = useRouter();
  const { useGetPosts, useDeletePost } = usePost();
  const { data: posts, isLoading } = useGetPosts();
  const deleteMutation = useDeletePost();
  const { userData } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [updatePostId, setUpdatePostId] = useState<any>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    if (!userData?.isCreator) {
      router.replace("/");
    }
  }, [userData, router]);

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
      loading={isLoading}
      dataSource={sortedPosts}
      pagination={{
        pageSize: 4,
        total: sortedPosts?.length,
        showSizeChanger: false,
        showTotal: (total) => `Total ${total} posts`,
        style: { textAlign: "center", marginTop: "20px" },
      }}
      renderItem={(post: Post) => (
        <List.Item>
          <Card
            style={{ width: "100%" }}
            extra={
              <Space size="middle">
                <Tag 
                  bordered={false} 
                  color={selectedCategory === post.category.id ? "success" : "processing"}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleCategoryClick(e, post.category.id)}
                >
                  {post.category.name}
                </Tag>
                <Divider type="vertical" />
                <Text type="secondary">
                  Created: {formatDateTime(post.createdAt)}
                </Text>
                <Text type="secondary">
                  Modified: {formatDateTime(post.updatedAt)}
                </Text>
                <Button
                  type="link"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  View
                </Button>
                <Button
                  type="link"
                  onClick={() =>
                    updatePostId === post.id
                      ? setUpdatePostId(null)
                      : setUpdatePostId(post.id)
                  }
                >
                  {updatePostId === post.id ? "Cancel" : "Update"}
                </Button>
                <Popconfirm
                  title="Are you sure to delete this post?"
                  onConfirm={() => deleteMutation.mutate(post.id!)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            {updatePostId === post.id ? (
              <EditPostForm
                post={post}
                onSave={() => setUpdatePostId(null)}
                onCancel={() => setUpdatePostId(null)}
              />
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Title level={4} style={{ margin: 0 }}>
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
              </Space>
            )}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default PostList;