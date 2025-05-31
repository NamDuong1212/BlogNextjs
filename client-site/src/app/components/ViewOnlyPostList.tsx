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
  Statistic,
  Empty,
  Badge,
  Tooltip,
  Skeleton,
  Input,
} from "antd";
import {
  DownOutlined,
  SortAscendingOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  FireOutlined,
  CalendarOutlined,
  SearchOutlined,
  CompassOutlined,
  TeamOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
  StarFilled,
  HeartFilled,
  ThunderboltFilled,
  LikeFilled,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";
import ImageComponentPostImage from "./ImageComponentPostImage";
import ImageComponentAvatar from "./ImageComponentAvatar";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

export const ViewOnlyPostList: React.FC = () => {
  const router = useRouter();
  const { useGetPosts, useGetPostsByCategory, useGetCategories } = usePost();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);

  const [sortOption, setSortOption] = useState<
    "viewAsc" | "viewDesc" | "dateAsc" | "dateDesc" | null
  >("dateDesc");

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data || [];

  // Function to find category by ID in the categories hierarchy
  const findCategoryById = (
    categoryId: string,
    categoryList = categories
  ): { category: any; path: any[] } | null => {
    for (const category of categoryList) {
      if (category.id === categoryId) {
        return {
          category,
          path: [category]
        };
      }
      if (category.children && category.children.length) {
        const result: { category: any; path: any[] } | null = findCategoryById(categoryId, category.children);
        if (result) {
          return {
            category: result.category,
            path: [category, ...result.path]
          };
        }
      }
    }
    return null;
  };

  // Handle tag click - set category filters based on the clicked category
  const handleCategoryTagClick = (e:any, categoryId:any) => {
    e.stopPropagation(); // Prevent the post card click event
    
    const result = findCategoryById(categoryId);
    if (result) {
      const { path } = result;
      
      // Reset all category selections
      setSelectedLevel1(null);
      setSelectedLevel2(null);
      setSelectedLevel3(null);
      setSelectedLevel4(null);
      
      // Set selected categories based on path depth
      if (path.length >= 1) setSelectedLevel1(path[0]);
      if (path.length >= 2) setSelectedLevel2(path[1]);
      if (path.length >= 3) setSelectedLevel3(path[2]);
      if (path.length >= 4) setSelectedLevel4(path[3]);
      
      // Set the selectedCategory to the clicked category
      setSelectedCategory(categoryId);
      
      // Reset to first page
      setCurrentPage(1);
    }
  };

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
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedLevel1(null);
    setSelectedLevel2(null);
    setSelectedLevel3(null);
    setSelectedLevel4(null);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Modified to include pagination parameters
  const { data: postResponse, isLoading: isCategoryLoading } =
    useGetPostsByCategory(selectedCategory || "", currentPage, pageSize);
  const { data: allPostsResponse, isLoading: isAllPostsLoading } = useGetPosts(
    currentPage,
    pageSize,
  );

  // Extract posts and pagination data
  const posts = selectedCategory ? postResponse?.data : allPostsResponse?.data;
  const pagination = selectedCategory
    ? postResponse?.pagination
    : allPostsResponse?.pagination;
  const isLoading = selectedCategory ? isCategoryLoading : isAllPostsLoading;

  // Update total posts when pagination data changes
  useEffect(() => {
    if (pagination) {
      setTotalPosts(pagination.total);
    }
  }, [pagination]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchQuery(params.get("search") || "");
  }, []);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter((post: Post) =>
      searchQuery
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );
  }, [posts, searchQuery]);

  const sortedPosts = useMemo(() => {
    if (!filteredPosts) return [];
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
        // Use server-side sorting by default
        break;
    }

    return sorted;
  }, [filteredPosts, sortOption]);

  // Get featured posts (newest 5)
  const { data: featuredPostsResponse } = useGetPosts(1, 5);
  const newestPosts = featuredPostsResponse?.data || [];

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const items: MenuProps["items"] = [
    {
      key: "viewAsc",
      label: "View Count (Low → High)",
      icon: <EyeOutlined />,
    },
    {
      key: "viewDesc",
      label: "View Count (High → Low)",
      icon: <EyeOutlined />,
    },
    {
      key: "dateAsc",
      label: "Created at (Old → New)",
      icon: <CalendarOutlined />,
    },
    {
      key: "dateDesc",
      label: "Created at (New → Old)",
      icon: <CalendarOutlined />,
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

  const totalViewCount =
    posts?.reduce(
      (sum: number, post: Post) => sum + (post.viewCount || 0),
      0,
    ) || 0;

  // Function to get random tag color for category
  const getTagColor = (index: number) => {
    const colors = [
      "magenta",
      "red",
      "volcano",
      "orange",
      "gold",
      "lime",
      "green",
      "cyan",
      "blue",
      "geekblue",
      "purple",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2} className="mb-2 text-indigo-800 font-bold">
            <GlobalOutlined className="mr-2 text-purple-600" /> Explore Posts
          </Title>
          <Text className="text-gray-600 text-lg">
            Discover the latest and most engaging posts from the community
          </Text>
        </div>

        <div className="mb-8">
          <Carousel
            autoplay
            effect="fade"
            className="rounded-xl overflow-hidden"
            autoplaySpeed={5000}
            dots={{ className: "custom-dots" }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent rounded-xl"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center mb-3">
                      <Badge
                        count={<FireOutlined style={{ color: "#fff" }} />}
                        color="#FF4D4F"
                        className="mr-2 animate-pulse"
                      />
                      <Tag
                        color="#FF4D4F"
                        className="border-0 mr-2 px-3 py-1 rounded-full font-medium"
                      >
                        Newest
                      </Tag>
                      {post.categoryHierarchy?.[0] && (
                        <Tag
                          color="#4F46E5"
                          className="border-0 px-3 py-1 rounded-full font-medium cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryTagClick(e, post.categoryHierarchy[0].id);
                          }}
                        >
                          {post.categoryHierarchy[0].name}
                        </Tag>
                      )}
                    </div>

                    <Title level={2} className="!text-white m-0 mb-3 font-bold">
                      {post.title}
                    </Title>

                    <Paragraph
                      className="text-gray-200 mb-4 text-lg"
                      ellipsis={{ rows: 2 }}
                    >
                      {post.content}
                    </Paragraph>

                    <Space className="text-gray-200 text-base">
                      <ClockCircleOutlined className="text-purple-300" />{" "}
                      {formatDateTime(post.createdAt)}
                      <Divider type="vertical" className="bg-gray-300" />
                      <EyeOutlined className="text-blue-300" />{" "}
                      {post.viewCount || 0} views
                      <Divider type="vertical" className="bg-gray-300" />
                      <Space>
                        <ImageComponentAvatar
                          size={28}
                          src={
                            post.user?.avatar ||
                            "https://i.imgur.com/CzXTtJV.jpg"
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

        {/* Stats Cards */}
        <div className="mb-8">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={12}>
              <Card className="text-center shadow-md rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-100 hover:shadow-lg transition-all">
                <Statistic
                  title={
                    <span className="text-indigo-800 font-medium">
                      Total Posts
                    </span>
                  }
                  value={totalPosts}
                  prefix={<FileTextOutlined className="text-indigo-600" />}
                  valueStyle={{ color: "#4F46E5" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={12}>
              <Card className="text-center shadow-md rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100 hover:shadow-lg transition-all">
                <Statistic
                  title={
                    <span className="text-purple-800 font-medium">
                      Total Views
                    </span>
                  }
                  value={totalViewCount}
                  prefix={<EyeOutlined className="text-purple-600" />}
                  valueStyle={{ color: "#9333EA" }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Category Filter */}
        <Card className="mb-8 shadow-lg rounded-xl bg-white border-none">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></div>
            <Title
              level={4}
              className="m-0 text-indigo-800 font-bold flex items-center"
            >
              <EnvironmentOutlined className="mr-2 text-indigo-600" />
              Category Filter
            </Title>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Select
              placeholder="Select Level 1 Category"
              style={{ width: 200 }}
              onChange={handleLevel1Change}
              value={selectedLevel1?.id || undefined}
              allowClear
              className="mb-2 sm:mb-0"
              popupClassName="custom-select-dropdown"
              dropdownStyle={{ borderRadius: "0.5rem" }}
            >
              {categories.map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Select Level 2 Category"
              style={{ width: 200 }}
              onChange={handleLevel2Change}
              value={selectedLevel2?.id || undefined}
              allowClear
              disabled={!selectedLevel1}
              className="mb-2 sm:mb-0"
              popupClassName="custom-select-dropdown"
              dropdownStyle={{ borderRadius: "0.5rem" }}
            >
              {(selectedLevel1?.children || []).map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Select Level 3 Category"
              style={{ width: 200 }}
              onChange={handleLevel3Change}
              value={selectedLevel3?.id || undefined}
              allowClear
              disabled={!selectedLevel2}
              className="mb-2 sm:mb-0"
              popupClassName="custom-select-dropdown"
              dropdownStyle={{ borderRadius: "0.5rem" }}
            >
              {(selectedLevel2?.children || []).map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Select Level 4 Category"
              style={{ width: 200 }}
              onChange={handleLevel4Change}
              value={selectedLevel4?.id || undefined}
              allowClear
              disabled={!selectedLevel3}
              className="mb-2 sm:mb-0"
              popupClassName="custom-select-dropdown"
              dropdownStyle={{ borderRadius: "0.5rem" }}
            >
              {(selectedLevel3?.children || []).map((cat: any) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>

            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button
                type="primary"
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 flex items-center shadow-md"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
              <Button
                onClick={handleReset}
                icon={<ArrowRightOutlined />}
                className="border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400 shadow-md"
              >
                All Posts
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
            <Title
              level={3}
              className="m-0 flex items-center text-purple-800 font-bold"
            >
              <span className="text-purple-600 mr-2">
                <CompassOutlined />
              </span>{" "}
              Posts
              {selectedCategory && selectedLevel1 && (
                <div className="flex ml-2 flex-wrap gap-1">
                  <Tag
                    color="purple"
                    className="text-base font-normal px-3 py-1 rounded-full"
                  >
                    {selectedLevel1.name}
                    {selectedLevel2 && ` > ${selectedLevel2.name}`}
                    {selectedLevel3 && ` > ${selectedLevel3.name}`}
                    {selectedLevel4 && ` > ${selectedLevel4.name}`}
                  </Tag>
                </div>
              )}
            </Title>
          </div>
          <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={["click"]}
          >
            <Button className="flex items-center shadow-sm border-purple-200 text-purple-600 hover:text-purple-700 hover:border-purple-400">
              <SortAscendingOutlined style={{ fontSize: "16px" }} /> Sort{" "}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* Posts List */}
        <List
          loading={isLoading}
          dataSource={sortedPosts}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No posts found"
                className="py-12"
              />
            ),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPosts,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} posts`,
            style: {
              textAlign: "right",
              marginTop: "20px",
              marginBottom: "20px",
            },
          }}
          grid={{ gutter: 24, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
          renderItem={(post: Post, index: number) => (
            <List.Item
              className="px-0 py-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card
                hoverable
                className="shadow-md rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300"
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
                    className="overflow-hidden relative"
                  >
                    <div className="h-full min-h-64 relative group">
                      <ImageComponentPostImage
                        src={post.image}
                        alt={post.title}
                        width="100%"
                        height="260px"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-80" />
                      <div className="absolute bottom-3 left-3 flex items-center">
                        <Badge
                          count={<EyeOutlined style={{ color: "#fff" }} />}
                          color="#4F46E5"
                          className="mr-2"
                        />
                        <Text className="text-white font-medium">
                          {post.viewCount || 0}
                        </Text>
                      </div>

                      {index < 3 && (
                        <div className="absolute top-3 right-3">
                          <Badge
                            count={
                              index === 0 ? (
                                <ThunderboltFilled style={{ color: "#fff" }} />
                              ) : index === 1 ? (
                                <StarFilled style={{ color: "#fff" }} />
                              ) : (
                                <HeartFilled style={{ color: "#fff" }} />
                              )
                            }
                            color={
                              index === 0
                                ? "#FF4D4F"
                                : index === 1
                                  ? "#FAAD14"
                                  : "#52C41A"
                            }
                            className="animate-pulse"
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap gap-2">
                        {post.categoryHierarchy?.map(
                          (cat: any, idx: number) => (
                            <Tag
                              key={cat.id}
                              color={getTagColor(idx)}
                              className="m-0 px-3 py-1 rounded-full font-medium cursor-pointer hover:opacity-80"
                              onClick={(e) => handleCategoryTagClick(e, cat.id)}
                            >
                              {cat.name}
                            </Tag>
                          ),
                        )}
                      </div>

                      <Title
                        level={4}
                        className="mb-3 text-indigo-800 font-bold hover:text-purple-700 transition-colors"
                      >
                        {post.title || "This post has no title"}
                      </Title>

                      <Paragraph
                        className="text-gray-600 mb-4 text-base"
                        ellipsis={{ rows: 3 }}
                      >
                        {post.content || "This post has no content"}
                      </Paragraph>

                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <Row
                          align="middle"
                          justify="space-between"
                          gutter={[16, 16]}
                        >
                          <Col xs={24} md={10}>
                            <Space>
                              <ImageComponentAvatar
                                size={40}
                                src={
                                  post.user?.avatar ||
                                  "https://i.imgur.com/CzXTtJV.jpg"
                                }
                                alt="User Avatar"
                              />
                              <div>
                                <Text strong className="text-green-700 block">
                                  {post.user?.username ||
                                    "Người dùng không xác định"}
                                </Text>
                                <Text className="text-xs text-gray-500">
                                  Author
                                </Text>
                              </div>
                            </Space>
                          </Col>

                          <Col xs={24} md={14}>
                            <Space className="text-gray-500 flex justify-end">
                              <Tooltip title="Create date">
                                <span className="flex items-center">
                                  <CalendarOutlined className="mr-1 text-indigo-500" />
                                  {formatDateTime(post.createdAt)}
                                </span>
                              </Tooltip>
                              <Divider type="vertical" />
                              <Tooltip title="Update date">
                                <span className="flex items-center">
                                  <ClockCircleOutlined className="mr-1 text-purple-500" />
                                  {formatDateTime(post.updatedAt)}
                                </span>
                              </Tooltip>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ViewOnlyPostList;