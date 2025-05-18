"use client";
import React, { useState, useRef } from "react";
import {
  Space,
  Typography,
  Tag,
  Button,
  Modal,
  Input,
  Form,
  Card,
  Avatar,
  Divider,
  Row,
  Col,
  Badge,
  Tooltip,
  Empty,
} from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  DownloadOutlined,
  FlagOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  TagOutlined,
  FireOutlined,
  GlobalOutlined,
  CompassOutlined,
  HeartFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import { usePost } from "@/app/hooks/usePost";
import { useReport } from "@/app/hooks/useReport";
import CommentSection from "@/app/components/CommentSection";
import LikeSection from "@/app/components/LikeSection";
import RatingSection from "@/app/components/RatingSection";
import NotFound from "@/app/not-found";
import { formatDateTime } from "@/app/utils/formatDateTime";
import ImageComponentPostImage from "@/app/components/ImageComponentPostImage";
import ImageComponentAvatar from "@/app/components/ImageComponentAvatar";
import Linkify from "react-linkify";
import html2pdf from "html2pdf.js";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Meta } = Card;

const PostDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [form] = Form.useForm();
  const relatedPostsRef = useRef<HTMLDivElement>(null);

  const { useGetPostById, useGetRelatedPosts } = usePost();
  const { useCreateReport } = useReport();
  const { data: post, isLoading } = useGetPostById(id as string);
  const { data: relatedPosts = [], isLoading: isLoadingRelated } =
    useGetRelatedPosts(id as string);

  const createReportMutation = useCreateReport(() => {
    setIsReportModalOpen(false);
    form.resetFields();
  });

  const handleReportSubmit = async (values: { reason: string }) => {
    if (!id) return;

    await createReportMutation.mutate({
      postId: id,
      data: { reason: values.reason },
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const pdfContent = document.createElement("div");
      const content = document.createElement("div");

      const originalContent = document.getElementById("post-content");
      if (originalContent) {
        const clone = originalContent.cloneNode(true) as HTMLElement;

        // Remove interactive elements
        const viewsElement = clone.querySelector(".view-count");
        const likesElement = clone.querySelector(".likes-section");
        const ratingsElement = clone.querySelector(".ratings-section");
        viewsElement?.remove();
        likesElement?.remove();
        ratingsElement?.remove();

        // Convert all images to base64 before PDF generation
        const images = clone.getElementsByTagName("img");
        await Promise.all(
          Array.from(images).map(async (img) => {
            try {
              const response = await fetch(img.src, {
                mode: "cors",
                credentials: "omit",
              });
              const blob = await response.blob();
              const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
              img.src = base64 as string;
            } catch (error) {
              console.error("Error converting image:", error);
              // If image conversion fails, remove it
              img.remove();
            }
          }),
        );

        content.innerHTML = clone.innerHTML;
      }

      const styleElement = document.createElement("style");
      styleElement.textContent = `
  .pdf-content {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    line-height: 1.6;
    color: #333;
    max-width: 800px;
    margin: auto;
  }
  h1, h2, h3 {
    color: #222;
    margin-top: 24px;
    margin-bottom: 16px;
  }
  p {
    margin-bottom: 12px;
    text-align: justify;
  }
  img {
    max-width: 100%;
    height: auto;
    margin: 16px 0;
    border-radius: 4px;
  }
  .ant-space {
    display: block !important;
  }
  .ant-space-item {
    margin-bottom: 20px !important;
  }
`;

      pdfContent.appendChild(styleElement);
      pdfContent.appendChild(content);

      const options = {
        margin: [10, 10, 10, 10],
        filename: `${post.title}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          imageTimeout: 15000,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().from(pdfContent).set(options).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const scrollRelatedPosts = (direction: "left" | "right") => {
    if (relatedPostsRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      relatedPostsRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const navigateToPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

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

  if (isLoading) {
    return (
    <div className="min-h-screen py-8 px-4 sm:px-8" style={{ background: "var(--background-gradient)" }}>
      <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg rounded-xl border-none p-6">
            <div className="animate-pulse">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="text-center mb-6">
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!post || !id) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  const featuredIndex = Math.floor(Math.random() * 3); // Simulate a featured post (0, 1, or 2)

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8" style={{ background: "var(--background-gradient)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            onClick={() => router.push('/')}
            icon={<LeftOutlined />}
            className="border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400 shadow-sm"
          >
            Back to Posts
          </Button>
        </div>

        {/* Main post content */}
        <Card 
          className="shadow-lg rounded-xl overflow-hidden border-none mb-8"
          id="post-content"
        >
          {/* Post Header */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div className="flex items-center mb-2 sm:mb-0">
                <ImageComponentAvatar
                  size={48}
                  src={post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
                  alt="User Avatar"
                />
                <div>
                  <Title level={5} className="m-0 text-indigo-800">
                    {post.user?.username || "User"}
                  </Title>
                  <Text className="text-gray-500 text-sm">Author</Text>
                </div>
              </div>
              
              <div>
                <Space>
                  <Tooltip title="Posted on">
                    <span className="flex items-center text-gray-500">
                      <CalendarOutlined className="mr-1 text-indigo-500" />
                      {formatDateTime(post.createdAt)}
                    </span>
                  </Tooltip>
                  <span className="view-count flex items-center text-gray-500">
                    <EyeOutlined className="mr-1 text-purple-500" />
                    {post.viewCount} views
                  </span>
                </Space>
              </div>
            </div>
            
            {/* Categories */}
            {post.categoryHierarchy?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {post.categoryHierarchy.map((cat: { id: string; name: string }, idx: number) => (
                  <Tag
                    key={cat.id}
                    color={getTagColor(idx)}
                    className="m-0 px-3 py-1 rounded-full font-medium"
                  >
                    {cat.name}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Post Title */}
          <Title level={2} className="text-center mb-6 text-indigo-800 font-bold">
            {post.title}
          </Title>

          {/* Featured Badge */}
          {featuredIndex < 3 && (
            <div className="absolute top-4 right-4">
              <Badge
                count={
                  featuredIndex === 0 ? (
                    <ThunderboltFilled style={{ color: "#fff" }} />
                  ) : featuredIndex === 1 ? (
                    <FireOutlined style={{ color: "#fff" }} />
                  ) : (
                    <HeartFilled style={{ color: "#fff" }} />
                  )
                }
                color={
                  featuredIndex === 0
                    ? "#FF4D4F"
                    : featuredIndex === 1
                      ? "#FAAD14"
                      : "#52C41A"
                }
                className="animate-pulse"
              />
            </div>
          )}

          {/* Post Image */}
          <div className="rounded-xl overflow-hidden shadow-md mb-8 relative">
            <ImageComponentPostImage
              images={post.images || (post.image ? [post.image] : [])}
              alt="Post Image"
              width="100%"
              height="400px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-60"></div>
          </div>

          {/* Post Content */}
          <div className="p-6 rounded-xl">
            <Paragraph 
              style={{ 
                whiteSpace: "pre-wrap", 
                fontSize: "16px", 
                lineHeight: "1.8",
                color: "#374151" 
              }}
            >
              <Linkify
                componentDecorator={(href, text, key) => (
                  <a
                    href={href}
                    key={key}
                    style={{ color: "#4F46E5", textDecoration: "underline" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {text}
                  </a>
                )}
              >
                {post.content}
              </Linkify>
            </Paragraph>
          </div>

          {/* Interactions */}
          <div className="mt-6">
            <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
              <Col span={10}>
                <div className="likes-section">
                  <LikeSection postId={id} />
                </div>
              </Col>
              <Col span={10}>
                <div className="ratings-section">
                  <RatingSection postId={id} />
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={isDownloading}
            size="large"
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center shadow-md"
          >
            Download PDF
          </Button>
          <Button
            danger
            icon={<FlagOutlined />}
            onClick={() => setIsReportModalOpen(true)}
            size="large"
            className="border-red-200 text-red-600 hover:text-red-700 hover:border-red-400 shadow-md"
          >
            Report
          </Button>
        </div>

        <Modal
          title={
            <div className="flex items-center">
              <FlagOutlined className="text-red-500 mr-2" /> 
              <span>Report Post</span>
            </div>
          }
          open={isReportModalOpen}
          onCancel={() => {
            setIsReportModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          className="report-modal"
        >
          <Form form={form} onFinish={handleReportSubmit} layout="vertical">
            <Form.Item
              name="reason"
              label="Reason for report"
              rules={[
                {
                  required: true,
                  message: "Please enter a reason for reporting",
                },
              ]}
            >
              <TextArea rows={4} placeholder="Enter report reason here..." />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <Button onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  loading={createReportMutation.isPending}
                >
                  Submit Report
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>

        {/* Comments */}
        <Card className="shadow-lg rounded-xl border-none mb-8">
          <div className="flex items-center mb-4">
            <div className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></div>
            <Title level={4} className="m-0 text-indigo-800 font-bold">
              <CompassOutlined className="mr-2 text-indigo-600" />
              Comments
            </Title>
          </div>
          
          {id && (
            <CommentSection
              postId={id}
              id=""
              content=""
              createdAt=""
              updatedAt=""
              user={{
                id: "",
                name: "",
              }}
              post={{
                id: "",
              }}
            />
          )}
        </Card>

        {/* Related Posts */}
        <Card className="shadow-lg rounded-xl border-none">
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <div className="flex items-center">
              <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
              <Title level={4} className="m-0 text-purple-800 font-bold flex items-center">
                <CompassOutlined className="mr-2 text-purple-600" />
                You Might Also Like
              </Title>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="default"
                icon={<LeftOutlined />}
                onClick={() => scrollRelatedPosts("left")}
                disabled={isLoadingRelated || relatedPosts.length === 0}
                className="border-purple-200 text-purple-600 hover:text-purple-700 hover:border-purple-400"
              />
              <Button
                type="default"
                icon={<RightOutlined />}
                onClick={() => scrollRelatedPosts("right")}
                disabled={isLoadingRelated || relatedPosts.length === 0}
                className="border-purple-200 text-purple-600 hover:text-purple-700 hover:border-purple-400"
              />
            </div>
          </div>

          <div
            ref={relatedPostsRef}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "16px",
              padding: "4px",
              scrollbarWidth: "thin",
              msOverflowStyle: "none",
              scrollSnapType: "x mandatory",
            }}
            className="hide-scrollbar"
          >
            {isLoadingRelated ? (
              <div style={{ padding: "20px", textAlign: "center", width: "100%" }}>
                Loading related posts...
              </div>
            ) : relatedPosts.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No related posts available"
                className="py-12 w-full"
              />
            ) : (
              relatedPosts.map((relatedPost: any, index: number) => (
                <Card
                  key={relatedPost.id}
                  hoverable
                  className="shadow-md rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300"
                  style={{
                    width: 280,
                    minWidth: 280,
                    scrollSnapAlign: "start",
                  }}
                  cover={
                    <div
                      style={{
                        height: 160,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <ImageComponentPostImage
                        alt={relatedPost.title}
                        src={
                          relatedPost.image
                            ? `${relatedPost.image}`
                            : "https://farm4.staticflickr.com/3224/3081748027_0ee3d59fea_z_d.jpg"
                        }
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-80" />
                      <div className="absolute bottom-3 left-3 flex items-center">
                        <Badge
                          count={<EyeOutlined style={{ color: "#fff" }} />}
                          color="#4F46E5"
                          className="mr-2"
                        />
                        <Text className="text-white font-medium">
                          {relatedPost.viewCount || 0}
                        </Text>
                      </div>
                      
                      {index < 3 && (
                        <div className="absolute top-3 right-3">
                          <Badge
                            count={index === 0 ? (
                              <ThunderboltFilled style={{ color: "#fff" }} />
                            ) : index === 1 ? (
                              <FireOutlined style={{ color: "#fff" }} />
                            ) : (
                              <HeartFilled style={{ color: "#fff" }} />
                            )}
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
                  }
                  onClick={() => navigateToPost(relatedPost.id)}
                >
                  <Meta
                    avatar={
                      <ImageComponentAvatar
                        size={35}
                        src={
                          relatedPost.user?.avatar ||
                          relatedPost.avatar ||
                          "https://i.imgur.com/CzXTtJV.jpg"
                        }
                        alt=""
                      />
                    }
                    title={
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {relatedPost.title}
                      </div>
                    }
                    description={
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            marginBottom: "6px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <UserOutlined
                            style={{ marginRight: 4, fontSize: "12px" }}
                          />
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {relatedPost.user?.username ||
                              relatedPost.author ||
                              "Unknown"}
                          </span>
                        </div>

                        {relatedPost.categoryHierarchy?.length > 0 && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#8c8c8c",
                              marginBottom: "4px",
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <TagOutlined
                              style={{ marginRight: 4, marginTop: "3px" }}
                            />
                            <div
                              style={{
                                flex: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {relatedPost.categoryHierarchy.map(
                                (cat: any, index: number) => (
                                  <React.Fragment key={cat.id}>
                                    <span>{cat.name}</span>
                                    {index <
                                      relatedPost.categoryHierarchy.length - 1 &&
                                      " > "}
                                  </React.Fragment>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#8c8c8c",
                            marginTop: "4px",
                          }}
                        >
                          <CalendarOutlined style={{ marginRight: 4 }} />
                          {formatDateTime(relatedPost.createdAt)}
                        </div>
                      </div>
                    }
                  />
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PostDetail;