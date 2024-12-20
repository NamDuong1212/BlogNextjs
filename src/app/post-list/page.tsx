"use client";
import React from "react";
import { List, Card, Button, Popconfirm, Space } from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";

export const PostList = () => {
  const router = useRouter();
  const { useGetPosts, useDeletePost } = usePost();

  const { data: posts, isLoading } = useGetPosts();
  const deleteMutation = useDeletePost();

  return (
    <List
      loading={isLoading}
      dataSource={posts}
      renderItem={(post: Post) => (
        <List.Item>
          <Card
            title={post.categoryId}
            style={{ width: "100%" }}
            extra={
              <Space>
                <Button
                  type="link"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  View
                </Button>
                <Button
                  type="link"
                  onClick={() => router.push(`/posts/edit/${post.id}`)}
                >
                  Edit
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
            <div
              style={{
                maxHeight: "4.5em",
                overflow: "hidden",
                textOverflow: "ellipsis",
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

export default PostList