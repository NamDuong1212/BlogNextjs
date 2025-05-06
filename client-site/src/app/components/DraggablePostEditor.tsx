"use client";
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Spin,
  Upload,
  message,
  Typography,
  Divider,
  Space,
  Alert,
} from "antd";
import {
  SnippetsOutlined,
  SaveOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import useAuthStore from "@/app/store/useAuthStore";
import { usePost } from "@/app/hooks/usePost";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface CreatePostFormProps {
  onClose: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onClose }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { userData } = useAuthStore();
  const { useGetCategories, useCreatePost, useUploadPostImage } = usePost();
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories();
  const createMutation = useCreatePost();
  const uploadMutation = useUploadPostImage();

  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    if (!userData?.isCreator) {
      message.error("You do not have permission to create a post");
      router.replace("/");
    }
  }, [userData, router]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onFinish = async (values: any) => {
    if (!userData?.id) {
      toast.error("User must be authenticated to create a post");
      return;
    }
    if (!selectedLevel4 || !selectedLevel4.id) {
      toast.error("Please select a complete category path (4 levels)");
      return;
    }

    setFormSubmitting(true);
    try {
      const dataToSubmit = {
        userId: userData.id,
        title: values.title.trim(),
        content: values.content.trim(),
        categoryId: selectedLevel4.id,
      };

      const createdPost = await createMutation.mutateAsync(dataToSubmit);

      if (selectedFile && createdPost?.id) {
        await uploadMutation.mutateAsync({
          id: createdPost.id,
          file: selectedFile,
        });
      }

      toast.success("Post created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again later.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Only image files are allowed!");
      return false;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    return false;
  };

  const categoryTree = categoriesResponse?.data || [];

  if (!mounted) {
    return (
      <Card style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        width: "900px",
        maxHeight: "80vh",
        resize: "horizontal",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <Title level={2} style={{ margin: 0 }}>
            <FileTextOutlined /> Create New Post
          </Title>
          <Text type="secondary">Share your journey with the community</Text>
        </div>

        {!userData?.isCreator && (
          <Alert
            message="Permission Required"
            description="You need Creator permissions to create a post."
            type="warning"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={!userData?.isCreator || formSubmitting}
        >
          <Form.Item label="Author">
            <Input
              value={userData?.username || ""}
              prefix={<Text type="secondary">@</Text>}
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Form.Item>

          <Divider orientation="left">
            <Space>
              <SnippetsOutlined /> Post Details
            </Space>
          </Divider>

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
              placeholder="Share your impressions of the exciting destination"
              showCount
              maxLength={10000}
            />
          </Form.Item>

          <Divider orientation="left">
            <Space>
              <AppstoreOutlined /> Select Category
            </Space>
          </Divider>

          <Form.Item
            label="Category Path"
            required
            help="Please select a complete category path (4 levels)"
          >
            {isCategoriesLoading ? (
              <div style={{ textAlign: "center", padding: "16px" }}>
                <Spin size="large" />
                <div style={{ marginTop: "8px" }}>Loading categories...</div>
              </div>
            ) : (
              <Space direction="vertical" style={{ width: "100%" }}>
                {/* Level 1 */}
                <Select
                  placeholder="Select main category"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                    const selected = categoryTree.find(
                      (cat: any) => cat.id === value,
                    );
                    setSelectedLevel1(selected);
                    setSelectedLevel2(null);
                    setSelectedLevel3(null);
                    setSelectedLevel4(null);
                    form.setFieldsValue({
                      level2: undefined,
                      level3: undefined,
                      level4: undefined,
                    });
                  }}
                  value={selectedLevel1?.id || undefined}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  {categoryTree.map((cat: any) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>

                {/* Level 2 */}
                {selectedLevel1?.children?.length > 0 && (
                  <Select
                    placeholder="Select subcategory (Level 2)"
                    style={{ width: "100%", marginTop: "8px" }}
                    onChange={(value) => {
                      const selected = selectedLevel1.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel2(selected);
                      setSelectedLevel3(null);
                      setSelectedLevel4(null);
                      form.setFieldsValue({
                        level3: undefined,
                        level4: undefined,
                      });
                    }}
                    value={selectedLevel2?.id || undefined}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {selectedLevel1.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}

                {/* Level 3 */}
                {selectedLevel2?.children?.length > 0 && (
                  <Select
                    placeholder="Select subcategory (Level 3)"
                    style={{ width: "100%", marginTop: "8px" }}
                    onChange={(value) => {
                      const selected = selectedLevel2.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel3(selected);
                      setSelectedLevel4(null);
                      form.setFieldsValue({ level4: undefined });
                    }}
                    value={selectedLevel3?.id || undefined}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {selectedLevel2.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}

                {/* Level 4 */}
                {selectedLevel3?.children?.length > 0 && (
                  <Select
                    placeholder="Select subcategory (Level 4)"
                    style={{ width: "100%", marginTop: "8px" }}
                    onChange={(value) => {
                      const selected = selectedLevel3.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel4(selected);
                    }}
                    value={selectedLevel4?.id || undefined}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {selectedLevel3.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}

                {/* Display selected path */}
                {selectedLevel1 && (
                  <div style={{ marginTop: "8px" }}>
                    <Text type="secondary">Selected path: </Text>
                    <Text strong>{selectedLevel1.name}</Text>
                    {selectedLevel2 && (
                      <>
                        <Text type="secondary"> → </Text>
                        <Text strong>{selectedLevel2.name}</Text>
                      </>
                    )}
                    {selectedLevel3 && (
                      <>
                        <Text type="secondary"> → </Text>
                        <Text strong>{selectedLevel3.name}</Text>
                      </>
                    )}
                    {selectedLevel4 && (
                      <>
                        <Text type="secondary"> → </Text>
                        <Text strong>{selectedLevel4.name}</Text>
                      </>
                    )}
                  </div>
                )}
              </Space>
            )}
          </Form.Item>

          <Divider orientation="left">
            <Space>
              <PictureOutlined /> Post Cover Image
            </Space>
          </Divider>

          <Form.Item
            label="Cover Image"
            help="Upload a cover image for your post"
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                accept="image/*"
              >
                {previewUrl ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Post preview"
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
                        color: "white",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      Change
                    </div>
                  </div>
                ) : (
                  <div>
                    <PictureOutlined style={{ fontSize: 24 }} />
                    <div style={{ marginTop: "8px" }}>Upload</div>
                  </div>
                )}
              </Upload>

              {selectedFile && (
                <div>
                  <Text>{selectedFile.name}</Text>
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </Space>
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
                Publish Post
              </Button>
              <Button onClick={onClose} disabled={formSubmitting}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePostForm;
