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
import ImageComponentPostImage from "../components/ImageComponentPostImage";

const { Text, Title } = Typography;

const POLLING_INTERVAL = 10000;

export const PostList = () => {
  const router = useRouter();
  const { useGetPostByCreator, useDeletePost } = usePost();
  const { userData } = useAuthStore();
  const { data: posts, isLoading, refetch } = useGetPostByCreator(userData?.id);
  const deleteMutation = useDeletePost();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [updatePostId, setUpdatePostId] = useState<any>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      refetch();
    }, POLLING_INTERVAL);

    return () => clearInterval(pollingInterval);
  }, [refetch]);

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
      !selectedCategory || post.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPosts = filteredPosts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryId: string | null | undefined,
  ) => {
    e.stopPropagation();
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        Latest Posts
      </Title>
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
            {updatePostId === post.id ? (
              <EditPostForm
                post={post}
                onSave={() => setUpdatePostId(null)}
                onCancel={() => setUpdatePostId(null)}
              />
            ) : (
              <div className="flex w-full gap-4 min-h-[200px]">
                <div className="flex-shrink-0 w-[300px] h-[200px]">
                  <ImageComponentPostImage
                    src={post.image}
                    alt="Post Image"
                    width="300px"
                    height="200px"
                  />
                </div>
                <Card
                  style={{ flex: 1 }}
                  extra={
                    <Space
                      size="small"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        {post.categoryHierarchy?.map(
                          (cat: {
                            id: React.Key | null | undefined;
                            name:
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | Promise<
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | React.ReactPortal
                                  | React.ReactElement<
                                      unknown,
                                      string | React.JSXElementConstructor<any>
                                    >
                                  | Iterable<React.ReactNode>
                                  | null
                                  | undefined
                                >
                              | null
                              | undefined;
                          }) => (
                            <Tag
                              key={cat.id}
                              bordered={false}
                              color={
                                selectedCategory === cat.id
                                  ? "success"
                                  : "processing"
                              }
                              style={{ cursor: "pointer" }}
                              onClick={(e) =>
                                cat.id &&
                                handleCategoryClick(e, cat.id.toString())
                              }
                            >
                              {cat.name}
                            </Tag>
                          ),
                        )}
                      </div>

                      {/* Các phần còn lại nằm bên phải */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text type="secondary">
                          Created: {formatDateTime(post.createdAt)}
                        </Text>
                        <Text type="secondary">
                          Modified: {formatDateTime(post.updatedAt)}
                        </Text>
                        <Text type="success">
                          Today Views: {post.viewCount || 0}
                        </Text>
                        <Button
                          type="link"
                          onClick={() => router.push(`/posts/${post.id}`)}
                        >
                          View
                        </Button>
                        <Button
                          type="link"
                          onClick={() => setUpdatePostId(post.id)}
                        >
                          Update
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
                      </div>
                    </Space>
                  }
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {post.title}
                    </Title>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.5em",
                        maxHeight: "3em",
                      }}
                    >
                      {post.content}
                    </div>
                  </Space>
                </Card>
              </div>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default PostList;
