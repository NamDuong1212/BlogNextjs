"use client";
import React, { useState } from "react";
import {
  List,
  Card,
  Button,
  Popconfirm,
  Space,
  Typography,
  Divider,
} from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import EditPostForm from "../components/EditPostForm";

const { Text, Title } = Typography;

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

export const PostList = () => {
  const router = useRouter();
  const { useGetPosts, useDeletePost } = usePost();
  const { data: posts, isLoading } = useGetPosts();
  const deleteMutation = useDeletePost();

  const [updatePostId, setUpdatePostId] = useState<any>(null);

  const Posts = posts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <List
      loading={isLoading}
      dataSource={Posts}
      pagination={{
        pageSize: 4,
        total: Posts?.length,
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
                <Text style={{ color: "red" }}>{post.category.name}</Text>
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
                <div>{post.content}</div>
              </Space>
            )}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default PostList;
