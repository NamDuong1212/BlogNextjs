"use client"
import React, { useState } from "react";
import { Space, Typography, Tag, Button, Modal, Input, Form } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  DownloadOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
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

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const PostDetail: React.FC = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { useGetPostById } = usePost();
  const { useCreateReport } = useReport();
  const { data: post, isLoading } = useGetPostById(id as string);
  const createReportMutation = useCreateReport(() => {
    setIsReportModalOpen(false);
    form.resetFields();
  });

  const handleReportSubmit = async (values: { reason: string }) => {
    if (!id) return;
    
    await createReportMutation.mutate({
      postId: id,
      data: { reason: values.reason }
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
        const images = clone.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(async (img) => {
          try {
            const response = await fetch(img.src, {
              mode: 'cors',
              credentials: 'omit'
            });
            const blob = await response.blob();
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            img.src = base64 as string;
          } catch (error) {
            console.error('Error converting image:', error);
            // If image conversion fails, remove it
            img.remove();
          }
        }));

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
                <Tag
                  bordered={false}
                  color="processing"
                  style={{ cursor: "pointer" }}
                >
                  {post.category.name}
                </Tag>
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
        <Form
          form={form}
          onFinish={handleReportSubmit}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason for reporting"
            rules={[{ required: true, message: "Please provide a reason for reporting" }]}
          >
            <TextArea
              rows={4}
              placeholder="Please describe why you are reporting this post..."
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
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
    </div>
  );
};

export default PostDetail;
