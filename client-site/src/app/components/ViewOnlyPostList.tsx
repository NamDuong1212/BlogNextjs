"use client";

import React, { useState } from "react";
import { List, Card, Typography, Space, Divider, Tag, Button } from "antd";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";
import ImageComponentPostImage from "./ImageComponentPostImage";
import ImageComponentAvatar from "./ImageComponentAvatar";

const { Title, Text } = Typography;

export const ViewOnlyPostList: React.FC = () => {
  const router = useRouter();
  const { useGetPosts, useGetPostsByCategory, useGetCategories } = usePost();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories } = useGetCategories();
  const { data: postsByCategory, isLoading: isCategoryLoading } =
    useGetPostsByCategory(selectedCategory || "");
  const { data: allPosts, isLoading: isAllPostsLoading } = useGetPosts();

  const posts = selectedCategory ? postsByCategory : allPosts;
  const isLoading = selectedCategory ? isCategoryLoading : isAllPostsLoading;

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
  }, [window.location.search]);

  const filteredPosts = React.useMemo(() => {
    return posts?.filter((post: Post) =>
      searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );
  }, [posts, searchQuery]);

  const sortedPosts = filteredPosts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <div className="flex gap-6 px-10">
      <div className="flex-grow">
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
            style: {
              textAlign: "right",
              marginBottom: "10px",
            },
          }}
          renderItem={(post: Post) => (
            <List.Item>
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
                  className="flex-1 cursor-pointer p-0"
                  style={{
                    width: "800px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onClick={() => router.push(`/posts/${post.id}`)}
                  extra={
                    <Space size="small">
                      <Tag bordered={false} color="processing">
                        {post.category?.name || "Uncategorized"}
                      </Tag>
                      <Divider type="vertical" />
                      <Text type="secondary">
                        {formatDateTime(post.updatedAt) || "No date"}
                      </Text>
                      <Divider type="vertical" />
                      <ImageComponentAvatar
                        size={35}
                        src={
                          post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"
                        }
                        alt="User Avatar"
                      />
                      <Text type="success">
                        {post.user?.username || "Unknown User"}
                      </Text>
                    </Space>
                  }
                >
                  <Title
                    level={5}
                    className="m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {post.title || "Untitled Post"}
                  </Title>
                  <div
                    className="overflow-hidden text-ellipsis leading-normal"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3, // Hiển thị tối đa 3 dòng
                      overflow: "hidden",
                    }}
                  >
                    {post.content || "No content available for this post."}
                  </div>
                </Card>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div className="w-64 flex-shrink-0">
        <Card className="sticky top-4">
          <Title level={4} className="mb-4">
            Categories
          </Title>
          <div className="flex flex-col gap-2">
            <Button
              type={selectedCategory === null ? "primary" : "default"}
              onClick={() => setSelectedCategory(null)}
              block
            >
              All Posts
            </Button>
            {categories?.map((category: any) => (
              <Button
                key={category.id}
                type={selectedCategory === category.id ? "primary" : "default"}
                onClick={() => setSelectedCategory(category.id)}
                block
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ViewOnlyPostList;
