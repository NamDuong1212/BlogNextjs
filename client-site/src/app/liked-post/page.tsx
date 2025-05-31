"use client";

import React, { useState, useEffect } from "react";
import { List, Card, Typography, Tag, Empty, Badge, Row, Col } from "antd";
import {
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePost } from "../hooks/usePost";
import { Post } from "../types/post";
import { formatDateTime } from "../utils/formatDateTime";
import useAuthStore from "../store/useAuthStore";
import ImageComponentPostImage from "../components/ImageComponentPostImage";

const { Text, Title, Paragraph } = Typography;

export const LikedPostsList = () => {
  const router = useRouter();
  const { useGetUserLikedPosts } = usePost();
  const { userData } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    data: postsResponse,
    isLoading,
    refetch,
  } = useGetUserLikedPosts(currentPage, pageSize);

  const posts = postsResponse?.data || [];

  // Update pagination details from response
  useEffect(() => {
    if (postsResponse?.pagination) {
      setTotalPosts(postsResponse.pagination.total);
      setTotalPages(postsResponse.pagination.totalPages);
    }
  }, [postsResponse]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle post click
  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card
          className="shadow-md rounded-xl mb-6 border-none overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-red-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <Title level={2} className="text-white m-0 flex items-center">
                  <HeartOutlined className="mr-2" /> Liked Posts
                </Title>
                <Text className="text-white opacity-80">
                  Posts you've liked and want to revisit
                </Text>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4">
              <Card className="bg-white bg-opacity-10 border-none inline-block">
                <div className="flex items-center">
                  <HeartOutlined className="text-white text-xl mr-2" />
                  <div>
                    <div className="text-white text-2xl font-bold">
                      {totalPosts}
                    </div>
                    <div className="text-white opacity-80 text-sm">
                      Liked Posts
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Posts List */}
        <List
          loading={isLoading}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="You haven't liked any posts yet"
              />
            ),
          }}
          dataSource={posts}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalPosts,
            onChange: handlePageChange,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} liked posts`,
            className: "mt-6",
          }}
          renderItem={(post: Post) => (
            <List.Item className="px-0 py-4">
              <Card
                className="w-full shadow-md rounded-xl overflow-hidden border-none hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                bodyStyle={{ padding: 0 }}
                onClick={() => handlePostClick(post.id!)}
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
                          count={<EyeOutlined style={{ color: "#fff" }} />}
                          color="blue"
                          className="mr-2"
                        />
                        <Text className="text-white font-medium">
                          {post.viewCount || 0}
                        </Text>
                      </div>
                      {/* Liked indicator */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          count={<HeartOutlined style={{ color: "#ff4d4f" }} />}
                          color="pink"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categoryHierarchy?.map((cat: any) => (
                        <Tag key={cat.id} color="processing" className="mb-0">
                          {cat.name}
                        </Tag>
                      ))}
                    </div>

                    {/* Title and Excerpt */}
                    <div className="mb-4">
                      <Title
                        level={4}
                        className="mb-2 text-lg md:text-xl hover:text-pink-600 transition-colors"
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

                    {/* Author and Metadata */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <Row align="middle" justify="space-between">
                        <Col xs={24} md={16}>
                          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                            <span className="flex items-center">
                              <span className="font-medium text-gray-700 mr-1">
                                By:
                              </span>
                              {post.author}
                            </span>
                            <span className="flex items-center">
                              <CalendarOutlined className="mr-1" />
                              {formatDateTime(post.createdAt)}
                            </span>
                          </div>
                        </Col>

                        <Col xs={24} md={8}>
                          <div className="flex justify-end mt-2 md:mt-0">
                            <div className="flex items-center text-pink-500 text-sm font-medium">
                              <HeartOutlined className="mr-1" />
                              Liked
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default LikedPostsList;
