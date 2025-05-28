"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Card,
  Space,
  Modal,
  Divider,
  Tabs,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Post } from "../types/post";
import { usePost } from "../hooks/usePost";
import toast from "react-hot-toast";
import EditItineraryForm from "./EditItineraryForm";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface EditPostFormProps {
  post: Post & { images?: string[] }; // Add optional images to the type
  onSave: () => void;
  onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const { useUpdatePost, useUploadPostImage, useDeletePostImage } = usePost();
  const updateMutation = useUpdatePost();
  const uploadMutation = useUploadPostImage();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("postDetails");

  // Initialize form with existing post data
  useEffect(() => {
    form.setFieldsValue({
      title: post.title,
      content: post.content,
    });

    // If post has existing images, create preview URLs
    if (post.images && post.images.length > 0) {
      const initialUrls = post.images;
      setPreviewUrls(initialUrls);
    }
  }, [post, form]);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Only image files are allowed!");
      return false;
    }

    if (selectedFiles.length >= 10) {
      toast.error("Maximum 10 images are allowed per post!");
      return false;
    }

    setSelectedFiles((prevFiles) => [...prevFiles, file]);
    setPreviewUrls((prevUrls) => [...prevUrls, URL.createObjectURL(file)]);
    return false;
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });

    setPreviewUrls((prevUrls) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prevUrls[index]);

      const newUrls = [...prevUrls];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const onFinish = async (values: any) => {
    setFormSubmitting(true);
    try {
      // Update post data
      const dataToSubmit = {
        id: post.id,
        title: values.title.trim(),
        content: values.content.trim(),
      };

      const updatedPost = await updateMutation.mutateAsync(dataToSubmit);

      // Upload images if new files are selected
      if (selectedFiles.length > 0 && updatedPost?.id) {
        await uploadMutation.mutateAsync({
          id: updatedPost.id,
          files: selectedFiles,
        });
      }

      toast.success("Post updated successfully");
      onSave();
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again later.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const deleteImageMutation = useDeletePostImage();

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      await deleteImageMutation.mutateAsync({
        postId: post.id!,
        imageUrl,
      });

      // Remove the image from local state
      setPreviewUrls((prevUrls) => prevUrls.filter((url) => url !== imageUrl));
      setSelectedFiles((prevFiles) =>
        prevFiles.filter((_, index) => previewUrls[index] !== imageUrl),
      );

      // If the first image (cover) is deleted, update the visual indication
      if (previewUrls[0] === imageUrl && previewUrls.length > 1) {
        // Visually indicate the new first image as cover
        // (This is already handled in the existing render logic)
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const renderPostDetails = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      disabled={formSubmitting}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: "Please enter a title for your post" },
          { min: 5, message: "Title must be at least 5 characters" },
          { max: 100, message: "Title cannot exceed 100 characters" },
        ]}
      >
        <Input placeholder="Your post title" maxLength={100} showCount />
      </Form.Item>

      <Form.Item
        name="content"
        label="Content"
        rules={[
          { required: true, message: "Please enter content for your post" },
          { min: 50, message: "Content must be at least 50 characters" },
        ]}
      >
        <TextArea
          rows={8}
          placeholder="Update your post content"
          showCount
          maxLength={10000}
        />
      </Form.Item>

      <Divider orientation="left">Post Images (Max 10)</Divider>

      <Form.Item
        label="Images"
        help={`Upload up to 10 images for your post (${selectedFiles.length}/10 uploaded)`}
      >
        <div className="clearfix">
          <Upload
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            accept="image/*"
            multiple
          >
            {selectedFiles.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {previewUrls.map((url, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "104px",
                  height: "104px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,0.65)",
                    padding: "4px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined style={{ color: "white" }} />}
                    onClick={() => handlePreview(url)}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined style={{ color: "white" }} />}
                    onClick={() => handleDeleteImage(url)}
                  />
                </div>

                {index === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      background: "rgba(0,132,255,0.75)",
                      color: "white",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    Cover
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <Text type="secondary">
              First image will be used as the cover image. You can upload up
              to {10 - previewUrls.length} more images.
            </Text>
          </div>
        )}
      </Form.Item>

      <Divider />

      <Form.Item>
        <Space style={{ float: "right" }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={formSubmitting}
            size="large"
          >
            Update Post
          </Button>
          <Button onClick={onCancel} disabled={formSubmitting}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  // Define tab items
  const tabItems = [
    {
      key: "postDetails",
      label: (
        <span>
          <FileTextOutlined /> Post Details
        </span>
      ),
      children: renderPostDetails()
    },
    {
      key: "itinerary",
      label: (
        <span>
          <CalendarOutlined /> Itinerary
        </span>
      ),
      children: (
        <div>
          <EditItineraryForm post={post} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0 }}>
          <FileTextOutlined /> Edit Post
        </Title>
        <Text type="secondary">Update your content</Text>
      </div>

      <Tabs 
        defaultActiveKey="postDetails" 
        onChange={handleTabChange}
        items={tabItems}
        size="large"
        style={{ marginBottom: "24px" }}
      />

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default EditPostForm;