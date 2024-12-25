"use client";
import React from "react";
import { List, Card, Typography, Space, Divider, Tag } from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";

const { Title, Text } = Typography;

export const ViewOnlyPostList: React.FC = () => {
  const router = useRouter();
  const { useGetPosts } = usePost();
  const [page, setPage] = React.useState(1);
  const { data: posts, isLoading } = useGetPosts(page, 10);
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get("search");

  const filteredPosts = posts?.filter(
    (post: any) =>
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const Posts = filteredPosts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <List
      style={{
        marginLeft: "40px",
        marginRight: "300px",
        marginBottom: "300px",
      }}
      loading={isLoading}
      dataSource={Posts}
      pagination={{
        pageSize: 10,
        current: page,
        total: Posts?.length,
        showSizeChanger: false,
        onChange: (page) => setPage(page),
        showTotal: (total) => `Total ${total} posts`,
        style: { textAlign: "right", marginBottom: "20px" },
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
                <Tag bordered={false} color="processing">
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
            <Text
              style={{
                fontSize: "12px",
                overflow: "hidden",
                maxHeight: "20px",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {post.content.length > 260
                ? `${post.content.slice(0, 260)}...`
                : post.content}
            </Text>
          </Card>
        </List.Item>
      )}
    />
  );
};
