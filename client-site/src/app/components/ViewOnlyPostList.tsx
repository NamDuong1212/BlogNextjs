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
  Carousel,
  Row,
  Col,
  MenuProps,
} from "antd";
import {
  DownOutlined,
  SortAscendingOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";
import ImageComponentPostImage from "./ImageComponentPostImage";
import ImageComponentAvatar from "./ImageComponentAvatar";

const { Title, Text, Paragraph } = Typography;

export const ViewOnlyPostList: React.FC = () => {
  const router = useRouter();
  const { useGetPosts, useGetPostsByCategory, useGetCategories } = usePost();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortOption, setSortOption] = useState<
    "viewAsc" | "viewDesc" | "dateAsc" | "dateDesc" | null
  >("dateDesc");

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

  const handleSearch = () => {
    const categoryId =
      selectedLevel4?.id ||
      selectedLevel3?.id ||
      selectedLevel2?.id ||
      selectedLevel1?.id ||
      null;
    setSelectedCategory(categoryId);
  };
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
    if (!posts) return [];
    return posts.filter((post: Post) =>
      searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );
  }, [posts, searchQuery]);

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
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "dateDesc":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return sorted;
  }, [filteredPosts, sortOption]);

  const newestPosts = useMemo(() => {
    if (!posts) return [];
    return [...posts]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [posts]);

  const items: MenuProps["items"] = [
    {
      key: "viewAsc",
      label: "View Count (Thấp → Cao)",
    },
    {
      key: "viewDesc",
      label: "View Count (Cao → Thấp)",
    },
    {
      key: "dateAsc",
      label: "Ngày Tạo (Cũ → Mới)",
    },
    {
      key: "dateDesc",
      label: "Ngày Tạo (Mới → Cũ)",
    },
  ];

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
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="mb-8">
        <Carousel
          autoplay
          effect="fade"
          className="rounded-lg overflow-hidden shadow-xl"
          autoplaySpeed={5000}
        >
          {newestPosts.map((post: Post) => (
            <div
              key={post.id}
              onClick={() => router.push(`/posts/${post.id}`)}
              className="cursor-pointer"
            >
              <div className="relative h-96">
                <ImageComponentPostImage
                  src={post.image}
                  alt={post.title}
                  width="100%"
                  height="100%"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Tag color="blue" className="mb-2">
                    <FireOutlined /> Mới nhất
                  </Tag>
                  <Title level={3} className="text-white m-0 mb-2">
                    {post.title}
                  </Title>
                  <Space className="text-gray-200">
                    <ClockCircleOutlined /> {formatDateTime(post.createdAt)}
                    <Divider type="vertical" className="bg-gray-300" />
                    <EyeOutlined /> {post.viewCount || 0} lượt xem
                    <Divider type="vertical" className="bg-gray-300" />
                    <Space>
                      <ImageComponentAvatar
                        size={24}
                        src={
                          post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"
                        }
                        alt="User Avatar"
                      />
                      {post.user?.username || "Unknown User"}
                    </Space>
                  </Space>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      <Card className="mb-8 shadow-md bg-blue-50">
        <Title level={4} className="text-center mb-4">
          <EnvironmentOutlined className="text-blue-600 mr-2" />
          Khám Phá Điểm Đến
        </Title>
        <div className="flex flex-wrap items-center justify-center gap-4">
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

          <Button
            type="primary"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Search
          </Button>
          <Button onClick={handleReset}>All Posts</Button>
        </div>
      </Card>

      {/* Posts List Header */}
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="m-0">
          <span className="text-blue-600">Post</span>
        </Title>
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
        >
          <Button>
            <SortAscendingOutlined style={{ fontSize: "16px" }} /> Sắp xếp{" "}
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      {/* Posts List */}
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
            marginBottom: "20px",
          },
        }}
        grid={{ gutter: 24, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        renderItem={(post: Post) => (
          <List.Item>
            <Card
              hoverable
              className="mb-4 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              styles={{ body: { padding: 0 } }}
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <Row gutter={0}>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={8}
                  xl={8}
                  className="overflow-hidden"
                >
                  <div className="h-full">
                    <ImageComponentPostImage
                      src={post.image}
                      alt={post.title}
                      width="100%"
                      height="200px"
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  <div className="p-6">
                    <div className="mb-4">
                      {post.categoryHierarchy?.map((cat: any) => (
                        <Tag key={cat.id} color="blue" className="mr-1">
                          {cat.name}
                        </Tag>
                      ))}
                    </div>

                    <Title level={4} className="mb-2 text-blue-800">
                      {post.title || "Untitled Post"}
                    </Title>

                    <Paragraph
                      className="text-gray-600 mb-4"
                      ellipsis={{ rows: 3 }}
                    >
                      {post.content || "No content available for this post."}
                    </Paragraph>

                    <div className="flex justify-between items-center">
                      <Space>
                        <ImageComponentAvatar
                          size={32}
                          src={
                            post.user?.avatar ||
                            "https://i.imgur.com/CzXTtJV.jpg"
                          }
                          alt="User Avatar"
                        />
                        <Text strong className="text-green-700">
                          {post.user?.username || "Unknown User"}
                        </Text>
                      </Space>

                      <Space className="text-gray-500">
                        <ClockCircleOutlined /> {formatDateTime(post.updatedAt)}
                        <Divider type="vertical" />
                        <EyeOutlined /> {post.viewCount || 0} lượt xem
                      </Space>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </List.Item>
        )}
      />
      {!selectedCategory && sortedPosts.length > 0 && (
        <div className="my-8">
          <Title level={3} className="text-center mb-6">
            <span className="text-green-600">ĐIỂM ĐẾN</span> NỔI BẬT
          </Title>
          <Row gutter={[16, 16]}>
            {sortedPosts.slice(0, 3).map((post: Post) => (
              <Col xs={24} sm={12} md={8} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div className="h-48 overflow-hidden">
                      <ImageComponentPostImage
                        src={post.image}
                        alt={post.title}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  }
                  className="rounded-lg shadow-md overflow-hidden h-full flex flex-col"
                  onClick={() => router.push(`/posts/${post.id}`)}
                >
                  <div className="mb-2">
                    {post.categoryHierarchy?.slice(0, 1).map((cat: any) => (
                      <Tag key={cat.id} color="cyan">
                        <EnvironmentOutlined /> {cat.name}
                      </Tag>
                    ))}
                  </div>
                  <Title level={5} ellipsis={{ rows: 2 }} className="mb-2">
                    {post.title}
                  </Title>
                  <div className="flex justify-between items-center mt-auto">
                    <Space>
                      <ImageComponentAvatar
                        size={24}
                        src={
                          post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"
                        }
                        alt="User Avatar"
                      />
                      <Text className="text-xs">{post.user?.username}</Text>
                    </Space>
                    <Text className="text-xs text-gray-500">
                      <EyeOutlined /> {post.viewCount || 0}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {!selectedCategory && categories.length > 0 && (
        <div className="my-8 bg-blue-50 p-6 rounded-lg shadow-md">
          <Title level={3} className="text-center mb-6">
            <span className="text-blue-600">DANH MỤC</span> PHỔ BIẾN
          </Title>
          <Row gutter={[16, 16]} justify="center">
            {categories.slice(0, 6).map((cat: any) => (
              <Col xs={12} sm={8} md={6} lg={4} key={cat.id}>
                <Card
                  hoverable
                  className="text-center rounded-lg shadow-sm"
                  onClick={() => {
                    handleLevel1Change(cat.id);
                    handleSearch();
                  }}
                >
                  <EnvironmentOutlined className="text-2xl text-blue-600" />
                  <Title level={5} className="mt-2 mb-0">
                    {cat.name}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="my-12 bg-gradient-to-r from-blue-500 to-green-500 p-8 rounded-lg shadow-lg text-white">
        <Row gutter={24} align="middle">
          <Col xs={24} md={16}>
            <Title level={3} className="text-white mb-2">
              ĐĂNG KÝ ĐỂ NHẬN TIN
            </Title>
            <Paragraph className="text-white opacity-80">
              Nhận thông tin về những điểm đến mới nhất và những trải nghiệm du
              lịch tuyệt vời!
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="text-center">
            <Button
              size="large"
              type="primary"
              ghost
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Đăng Ký Ngay
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ViewOnlyPostList;
