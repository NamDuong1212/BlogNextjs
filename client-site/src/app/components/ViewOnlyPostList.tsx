"use client";

import React, { useState, useMemo, useEffect } from "react";
import { List, Card, Typography, Space, Divider, Tag, Button, Select } from "antd";
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

  // selectedCategory sẽ được cập nhật khi ấn nút Search
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // State cho từng dropdown level
  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Lấy danh mục dạng cây
  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data || [];

  const handleLevel1Change = (value: string) => {
    const selected = categories.find((cat: any) => cat.id === value);
    setSelectedLevel1(selected);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
  };

  const handleLevel2Change = (value: string) => {
    const level2Options = selectedLevel1?.children || [];
    const selected = level2Options.find((cat: any) => cat.id === value);
    setSelectedLevel2(selected);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
  };

  const handleLevel3Change = (value: string) => {
    const level3Options = selectedLevel2?.children || [];
    const selected = level3Options.find((cat: any) => cat.id === value);
    setSelectedLevel3(selected);
    setSelectedLevel4(null);
  };

  const handleLevel4Change = (value: string) => {
    const level4Options = selectedLevel3?.children || [];
    const selected = level4Options.find((cat: any) => cat.id === value);
    setSelectedLevel4(selected);
  };

  // Khi nhấn Search, chọn danh mục cuối cùng được chọn làm filter
  const handleSearch = () => {
    const categoryId =
      selectedLevel4?.id || selectedLevel3?.id || selectedLevel2?.id || selectedLevel1?.id || null;
    setSelectedCategory(categoryId);
  };

  // Reset toàn bộ lựa chọn
  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
  };

  const { data: postsByCategory, isLoading: isCategoryLoading } =
    useGetPostsByCategory(selectedCategory || "");
  const { data: allPosts, isLoading: isAllPostsLoading } = useGetPosts();

  const posts = selectedCategory ? postsByCategory : allPosts;
  const isLoading = selectedCategory ? isCategoryLoading : isAllPostsLoading;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
  }, [window.location.search]);

  const filteredPosts = useMemo(() => {
    return posts?.filter((post: Post) =>
      searchQuery ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) : true,
    );
  }, [posts, searchQuery]);

  const sortedPosts = filteredPosts
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

  return (
    <div className="px-10">
      {/* Các dropdown hiển thị theo chiều ngang */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Dropdown cấp 1 */}
        <Select
          placeholder="Chọn danh mục cấp 1"
          style={{ width: 200 }}
          onChange={handleLevel1Change}
          value={selectedLevel1?.id || undefined}
          allowClear
        >
          {categories.map((cat: any) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        {/* Dropdown cấp 2 */}
        <Select
          placeholder="Chọn danh mục cấp 2"
          style={{ width: 200 }}
          onChange={handleLevel2Change}
          value={selectedLevel2?.id || undefined}
          allowClear
          disabled={!selectedLevel1}
        >
          {(selectedLevel1?.children || []).map((cat: any) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        {/* Dropdown cấp 3 */}
        <Select
          placeholder="Chọn danh mục cấp 3"
          style={{ width: 200 }}
          onChange={handleLevel3Change}
          value={selectedLevel3?.id || undefined}
          allowClear
          disabled={!selectedLevel2}
        >
          {(selectedLevel2?.children || []).map((cat: any) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        {/* Dropdown cấp 4 */}
        <Select
          placeholder="Chọn danh mục cấp 4"
          style={{ width: 200 }}
          onChange={handleLevel4Change}
          value={selectedLevel4?.id || undefined}
          allowClear
          disabled={!selectedLevel3}
        >
          {(selectedLevel3?.children || []).map((cat: any) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>

        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>

        <Button onClick={handleReset}>
          All Posts
        </Button>
      </div>

      {/* Danh sách bài viết */}
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
                      src={post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
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
                    WebkitLineClamp: 3,
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
  );
};

export default ViewOnlyPostList;
