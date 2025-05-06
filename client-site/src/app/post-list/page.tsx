"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Popconfirm,
  Space,
  Typography,
  Tag,
  Empty,
  Tooltip,
  Statistic,
  Row,
  Col,
  Badge,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import EditPostForm from "../components/EditPostForm";
import { formatDateTime } from "../utils/formatDateTime";
import useAuthStore from "../store/useAuthStore";
import ImageComponentPostImage from "../components/ImageComponentPostImage";
import CreatePostForm from "../components/DraggablePostEditor";
import { motion, AnimatePresence } from "framer-motion";


const { Text, Title, Paragraph } = Typography;

const POLLING_INTERVAL = 10000;

export const PostList = () => {
  const router = useRouter();
  const { useGetPostByCreator, useDeletePost } = usePost();
  const { userData } = useAuthStore();
  const [isFormVisible, setFormVisible] = useState(false);
  const closeForm = () => setFormVisible(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Other state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [updatePostId, setUpdatePostId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [showLoadingIndicator, setShowLoadingIndicator] = useState<boolean>(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  
  // Fetch posts with pagination
  const { 
    data: postsResponse, 
    isLoading, 
    refetch 
  } = useGetPostByCreator(userData?.id, currentPage, pageSize);
  
  const posts = postsResponse?.data || [];
  const deleteMutation = useDeletePost();

  // Update pagination details from response
  useEffect(() => {
    if (postsResponse?.pagination) {
      setTotalPosts(postsResponse.pagination.total);
      setTotalPages(postsResponse.pagination.totalPages);
    }
  }, [postsResponse]);

  // Calculate total views and extract unique categories
  useEffect(() => {
    if (posts && posts.length > 0) {
      const views = posts.reduce((sum: number, post: Post) => sum + (post.viewCount || 0), 0);
      setTotalViews(views);

      const categories: any[] = [];
      posts.forEach((post: Post) => {
        post.categoryHierarchy?.forEach((cat: any) => {
          if (!categories.some(c => c.id === cat.id)) {
            categories.push(cat);
          }
        });
      });
      setAllCategories(categories);
    }
  }, [posts]);

  // Read URL query for search
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setSearchText(searchQuery);
    }
  }, []);

  // Polling for auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLoadingIndicator(true);
      refetch().finally(() => {
        setTimeout(() => setShowLoadingIndicator(false), 500);
      });
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [refetch]);

  // Redirect non-creators to home
  useEffect(() => {
    if (!userData?.isCreator) {
      router.replace("/");
    }
  }, [userData, router]);

  // Client-side filtering by search and category
  const filteredPosts = posts.filter((post: Post) => {
    const matchesSearch = !searchText || post.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || post.category.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <Card className="shadow-md rounded-xl mb-6 border-none overflow-hidden" bodyStyle={{ padding: 0 }}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <Title level={2} className="text-white m-0 flex items-center">
                  <FileTextOutlined className="mr-2" /> Manage Posts
                </Title>
                <Text className="text-white opacity-80">
                  Oversee and track your content
                </Text>
              </div>
            </div>
            
            {/* Stats Row */}
            <Row gutter={16} className="mt-4">
              <Col xs={12} md={8}>
                <Card className="bg-white bg-opacity-10 border-none">
                  <Statistic 
                    title={<span className="text-white opacity-80">Total Posts</span>}
                    value={totalPosts}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: 'white' }}
                  />
                </Card>
              </Col>
              <Col xs={12} md={8}>
                <Card className="bg-white bg-opacity-10 border-none">
                  <Statistic 
                    title={<span className="text-white opacity-80">Total Views</span>}
                    value={totalViews}
                    prefix={<EyeOutlined />} 
                    valueStyle={{ color: 'white' }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={8} className="mt-4 md:mt-0">
                <Card className="bg-white bg-opacity-10 border-none">
                  <Statistic 
                    title={<span className="text-white opacity-80">Most Recent Post</span>}
                    value={posts[0] ? formatDateTime(posts[0].createdAt).split(' ')[0] : 'N/A'}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: 'white' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Posts List */}
        <List
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No posts available"
              />
            ),
          }}
          dataSource={filteredPosts}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPosts,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} posts`,
            className: "mt-6",
          }}
          renderItem={(post: Post) => (
            <List.Item className="px-0 py-4">
              {updatePostId === post.id ? (
                <Card className="w-full shadow-md rounded-xl overflow-hidden border-none">
                  <EditPostForm
                    post={post}
                    onSave={() => {
                      setUpdatePostId(null);
                      refetch();
                    }}
                    onCancel={() => setUpdatePostId(null)}
                  />
                </Card>
              ) : (
                <Card 
                  className="w-full shadow-md rounded-xl overflow-hidden border-none hover:shadow-lg transition-shadow"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Post Image */}
                    <div 
                      className="md:w-1/3 lg:w-1/4 relative overflow-hidden" 
                      style={{ minHeight: "220px" }}
                    >
                      <div className="absolute inset-0">
                        <ImageComponentPostImage
                          src={post.image}
                          alt={post.title}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-60" />
                        <div className="absolute bottom-2 left-2 flex items-center">
                          <Badge 
                            count={<EyeOutlined style={{ color: '#fff' }} />} 
                            color="blue"
                            className="mr-2"
                          />
                          <Text className="text-white font-medium">
                            {post.viewCount || 0}
                          </Text>
                        </div>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categoryHierarchy?.map((cat: any) => (
                          <Tag
                            key={cat.id}
                            color={selectedCategory === cat.id ? "success" : "processing"}
                            className="cursor-pointer mb-0"
                          >
                            {cat.name}
                          </Tag>
                        ))}
                      </div>
                      
                      {/* Title and Excerpt */}
                      <div className="mb-4">
                        <Title 
                          level={4} 
                          className="mb-2 text-lg md:text-xl hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => router.push(`/posts/${post.id}`)}
                        >
                          {post.title}
                        </Title>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          className="text-gray-600 mb-2"
                        >
                          {post.content}
                        </Paragraph>
                      </div>
                      
                      {/* Metadata and Actions */}
                      <div className="mt-auto pt-3 border-t border-gray-100">
                        <Row align="middle" justify="space-between" gutter={[16, 16]}>
                          <Col xs={24} md={14}>
                            <Space size="middle" className="text-gray-500 text-sm">
                              <Tooltip title="Created Date">
                                <span className="flex items-center">
                                  <CalendarOutlined className="mr-1" />
                                  {formatDateTime(post.createdAt)}
                                </span>
                              </Tooltip>
                              <Tooltip title="Last Updated">
                                <span className="flex items-center">
                                  <ClockCircleOutlined className="mr-1" />
                                  {formatDateTime(post.updatedAt)}
                                </span>
                              </Tooltip>
                            </Space>
                          </Col>
                          
                          <Col xs={24} md={10}>
                            <Space size="middle" className="flex justify-end">
                              <Tooltip title="View Post">
                                <Button
                                  type="default"
                                  icon={<EyeOutlined />}
                                  onClick={() => router.push(`/posts/${post.id}`)}
                                >
                                  View
                                </Button>
                              </Tooltip>
                              <Tooltip title="Edit Post">
                                <Button
                                  type="primary"
                                  icon={<EditOutlined />}
                                  onClick={() => setUpdatePostId(post.id ?? null)}
                                  ghost
                                >
                                  Edit
                                </Button>
                              </Tooltip>
                              <Popconfirm
                                title="Confirm delete post"
                                description="Are you sure you want to delete this post? This action cannot be undone."
                                onConfirm={() => {
                                  deleteMutation.mutate(post.id!, {
                                    onSuccess: () => {
                                      refetch();
                                    }
                                  });
                                }}
                                okText="Delete"
                                cancelText="Cancel"
                                placement="topRight"
                              >
                                <Tooltip title="Delete Post">
                                  <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                  >
                                    Delete
                                  </Button>
                                </Tooltip>
                              </Popconfirm>
                            </Space>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </List.Item>
          )}
        />
        
        {/* Auto-refresh indicator */}
        <div className="text-center mt-6 text-gray-500">
          <Text type="secondary" className="flex items-center justify-center">
            <SyncOutlined spin={showLoadingIndicator} className="mr-2" />
            {showLoadingIndicator 
              ? "Updating data..." 
              : "Data auto-refreshes every 10 seconds"}
          </Text>
        </div>
      </div>
      {/* Create Post Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: isFormVisible ? 135 : 0 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            onClick={() => setFormVisible((prev) => !prev)}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 8px rgba(0, 200, 255, 0.8)",
                "0 0 16px rgba(0, 200, 255, 0.9)",
                "0 0 8px rgba(0, 200, 255, 0.8)",
                "0 0 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 hover:from-pink-400 hover:to-blue-400 transition duration-300 ease-in-out shadow-xl"
          >
            <PlusOutlined />
          </motion.button>
        </motion.div>
      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-4xl max-h-[90vh] overflow-auto"
            >
              <CreatePostForm onClose={closeForm} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostList;
