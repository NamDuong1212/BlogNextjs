"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  List,
  Card,
  Typography,
  Space,
  Divider,
  Tag,
  Button,
  Select,
  Dropdown,
  MenuProps
} from "antd";
import { DownOutlined, SortAscendingOutlined } from "@ant-design/icons";
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

  // Các state phục vụ chọn danh mục
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State cho sắp xếp
  // viewAsc / viewDesc / dateAsc / dateDesc / null
  const [sortOption, setSortOption] = useState<
    "viewAsc" | "viewDesc" | "dateAsc" | "dateDesc" | null
  >(null);

  // Lấy dữ liệu danh mục
  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data || [];

  // Các hàm chọn danh mục
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
      selectedLevel4?.id ||
      selectedLevel3?.id ||
      selectedLevel2?.id ||
      selectedLevel1?.id ||
      null;
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

  // Lấy posts
  const { data: postsByCategory, isLoading: isCategoryLoading } =
    useGetPostsByCategory(selectedCategory || "");
  const { data: allPosts, isLoading: isAllPostsLoading } = useGetPosts();

  const posts = selectedCategory ? postsByCategory : allPosts;
  const isLoading = selectedCategory ? isCategoryLoading : isAllPostsLoading;

  // Lấy param ?search= trên URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
  }, [window.location.search]);

  // Lọc bài viết theo search
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post: Post) =>
      searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  }, [posts, searchQuery]);

  // Sắp xếp bài viết theo sortOption
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];

    switch (sortOption) {
      case "viewAsc":
        sorted.sort((a, b) => (a.viewCount || 0) - (b.viewCount || 0));
        break;
      case "viewDesc":
        sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case "dateAsc":
        sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "dateDesc":
        sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredPosts, sortOption]);

  // Menu sort cho Dropdown
  const items: MenuProps["items"] = [
    {
      key: "viewAsc",
      label: "View Count (Thấp -> Cao)",
    },
    {
      key: "viewDesc",
      label: "View Count (Cao -> Thấp)",
    },
    {
      key: "dateAsc",
      label: "Ngày Tạo (Cũ -> Mới)",
    },
    {
      key: "dateDesc",
      label: "Ngày Tạo (Mới -> Cũ)",
    },
  ];

  // Xử lý khi chọn 1 item trong dropdown
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (
      key === "viewAsc" ||
      key === "viewDesc" ||
      key === "dateAsc" ||
      key === "dateDesc"
    ) {
      setSortOption(key);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      {/* Khu vực chọn danh mục & nút search/reset */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
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
        <Button onClick={handleReset}>All Posts</Button>
      </div>

      {/* Header cho danh sách bài viết: "Bài viết" bên trái & sort bên phải */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Bài viết</h2>
        <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
          <Button>
            <SortAscendingOutlined style={{ fontSize: "16px" }} /> <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      {/* Danh sách bài viết */}
      <List
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
            <div className="flex w-full gap-4 min-h-[200px] p-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              {/* Ảnh bài viết */}
              <div className="flex-shrink-0 w-[300px] h-[200px] overflow-hidden">
                <ImageComponentPostImage
                  src={post.image}
                  alt="Post Image"
                  width="300px"
                  height="200px"
                />
              </div>

              {/* Card hiển thị tiêu đề, nội dung, etc. */}
              <Card
                className="flex-1 cursor-pointer p-4"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  border: "none",
                  boxShadow: "none",
                }}
                onClick={() => router.push(`/posts/${post.id}`)}
                extra={
                  <Space size="small">
                    {/* Danh mục */}
                    <div>
                      {post.categoryHierarchy?.map((cat: any) => (
                        <Tag key={cat.id} bordered={false} color="processing">
                          {cat.name}
                        </Tag>
                      ))}
                    </div>
                    <Divider type="vertical" />
                    {/* Ngày cập nhật */}
                    <Text type="secondary">
                      {formatDateTime(post.updatedAt) || "No date"}
                    </Text>
                    <Divider type="vertical" />
                    {/* Avatar và tên người viết */}
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
                  className="m-0 mb-2 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {post.title || "Untitled Post"}
                </Title>
                {/* Đoạn mô tả ngắn (giới hạn 3 dòng) */}
                <div
                  className="text-gray-600"
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
