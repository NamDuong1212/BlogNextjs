"use client";
import React, { useState, useRef } from "react";
import { Space, Typography, Tag, Button, Modal, Input, Form, Card, Avatar } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  DownloadOutlined,
  FlagOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  TagOutlined,
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
  const { data: relatedPosts = [], isLoading: isLoadingRelated } = useGetRelatedPosts(id as string);
  
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
        .pdf-content { padding: 20px; }
        img { max-width: 100%; height: auto; }
        .ant-space { display: block !important; }
        .ant-space-item { margin-bottom: 20px !important; }
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
          imageTimeout: 15000, // Increase timeout for image loading
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

  const scrollRelatedPosts = (direction: 'left' | 'right') => {
    if (relatedPostsRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      relatedPostsRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const navigateToPost = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post || !id) {
    return (
      <div>
        <NotFound />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div id="post-content">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <ImageComponentAvatar
              size={80}
              src={post.user?.avatar || "https://i.imgur.com/CzXTtJV.jpg"}
              alt="User Avatar"
            />
            <Title level={4}>{post.user?.username || "Testing"}</Title>
            <Paragraph>
              <Space size="large">
                {post.categoryHierarchy?.length > 0 && (
                  <Space size="small">
                  {post.categoryHierarchy?.map((cat: { id: string; name: string }) => (
                    <Tag key={cat.id} bordered={false} color="processing" style={{ cursor: "pointer" }}>
                      {cat.name}
                    </Tag>
                  ))}
                </Space>
                
                )}

                <span>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {formatDateTime(post.createdAt)}
                </span>
                <span className="view-count">
                  <EyeOutlined style={{ marginRight: 4 }} />
                  {post.viewCount} views
                </span>
              </Space>
            </Paragraph>
          </div>

          <Title level={2} style={{ textAlign: "center" }}>
            {post.title}
          </Title>

          {post.image ? (
            <div style={{ textAlign: "center" }}>
              <ImageComponentPostImage
                src={post.image}
                alt="Post Image"
                width="100%"
                height="100%"
              />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <img
                src="https://farm4.staticflickr.com/3224/3081748027_0ee3d59fea_z_d.jpg"
                alt="Default Image"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          )}

          <Paragraph style={{ whiteSpace: "pre-wrap" }}>
            <Linkify
              componentDecorator={(
                href: string | undefined,
                text:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined,
                key: React.Key | null | undefined,
              ) => (
                <a
                  href={href}
                  key={key}
                  style={{ color: "dodgerblue", textDecoration: "underline" }}
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

          <div className="likes-section">
            <LikeSection postId={id} />
          </div>
          <div className="ratings-section">
            <RatingSection postId={id} />
          </div>
        </Space>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={isDownloading}
          size="large"
        >
          Download as PDF
        </Button>
        <Button
          type="default"
          danger
          icon={<FlagOutlined />}
          onClick={() => setIsReportModalOpen(true)}
          size="large"
        >
          Report Post
        </Button>
      </div>

      <Modal
        title="Report Post"
        open={isReportModalOpen}
        onCancel={() => {
          setIsReportModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleReportSubmit} layout="vertical">
          <Form.Item
            name="reason"
            label="Reason for reporting"
            rules={[
              {
                required: true,
                message: "Please provide a reason for reporting",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Please describe why you are reporting this post..."
            />
          </Form.Item>
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button onClick={() => setIsReportModalOpen(false)}>
                Cancel
              </Button>
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

      {id && (
        <CommentSection
          postId={id}
          id={""}
          content={""}
          createdAt={""}
          updatedAt={""}
          user={{
            id: "",
            name: "",
          }}
          post={{
            id: "",
          }}
        />
      )}

      {/* Related Posts Section */}
      <div style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <Title level={4} style={{ margin: 0 }}>Related Posts</Title>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button 
              type="default" 
              icon={<LeftOutlined />} 
              onClick={() => scrollRelatedPosts('left')}
              disabled={isLoadingRelated || relatedPosts.length === 0}
            />
            <Button 
              type="default" 
              icon={<RightOutlined />} 
              onClick={() => scrollRelatedPosts('right')}
              disabled={isLoadingRelated || relatedPosts.length === 0}
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
            scrollSnapType: "x mandatory"
          }}
          className="hide-scrollbar"
        >
          {isLoadingRelated ? (
            <div style={{ padding: "20px", textAlign: "center", width: "100%" }}>Loading related posts...</div>
          ) : relatedPosts.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", width: "100%" }}>No related posts found</div>
          ) : (
            relatedPosts.map((relatedPost: any) => (
              <Card
                key={relatedPost.id}
                hoverable
                style={{ 
                  width: 280, 
                  minWidth: 280,
                  scrollSnapAlign: "start"
                }}
                cover={
                  <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                    <ImageComponentPostImage
                      alt={relatedPost.title}
                      src={relatedPost.image ? `${relatedPost.image}` : "https://farm4.staticflickr.com/3224/3081748027_0ee3d59fea_z_d.jpg"}
                    />
                  </div>
                }
                onClick={() => navigateToPost(relatedPost.id)}
              >
                <Meta
                  avatar={
                    <ImageComponentAvatar
                      size={35}
                      src={relatedPost.user?.avatar || relatedPost.avatar || "https://i.imgur.com/CzXTtJV.jpg"} alt={""}                    />
                  }
                  title={
                    <div style={{ 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis" 
                    }}>
                      {relatedPost.title}
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ 
                        fontSize: "13px", 
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center"
                      }}>
                        <UserOutlined style={{ marginRight: 4, fontSize: "12px" }} />
                        <span style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {relatedPost.user?.username || relatedPost.author || "Unknown"}
                        </span>
                      </div>
                      
                      {relatedPost.categoryHierarchy?.length > 0 && (
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#8c8c8c",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "flex-start"
                        }}>
                          <TagOutlined style={{ marginRight: 4, marginTop: "3px" }} />
                          <div style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical"
                          }}>
                            {relatedPost.categoryHierarchy.map((cat: any, index: number) => (
                              <React.Fragment key={cat.id}>
                                <span>{cat.name}</span>
                                {index < relatedPost.categoryHierarchy.length - 1 && " > "}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#8c8c8c",
                        marginTop: "4px"
                      }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {formatDateTime(relatedPost.createdAt).split(' ')[0]}
                      </div>
                    </div>
                  }
                />
              </Card>
            ))
          )}
        </div>
        
        {/* CSS for hiding scrollbar but keeping functionality */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            height: 6px;
          }
          
          .hide-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
          }
          
          .hide-scrollbar::-webkit-scrollbar-track {
            background-color: transparent;
          }
          
          @media (hover: none) {
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PostDetail;