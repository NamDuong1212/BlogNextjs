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
  Modal,
  Tabs,
} from "antd";
import {
  SnippetsOutlined,
  SaveOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  PictureOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import useAuthStore from "@/app/store/useAuthStore";
import { usePost } from "@/app/hooks/usePost";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreateItineraryForm } from "./CreateItineraryForm"; // Import the CreateItineraryForm component

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // New states for itinerary integration
  const [activeTab, setActiveTab] = useState("post");
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);
  const [postCreationCompleted, setPostCreationCompleted] = useState(false);

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
      // Clean up object URLs when component unmounts
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // Handle successful itinerary creation
  const handleItinerarySuccess = () => {
    toast.success("Post and itinerary created successfully!");
    onClose();
  };

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

      if (selectedFiles.length > 0 && createdPost?.id) {
        await uploadMutation.mutateAsync({
          id: createdPost.id,
          files: selectedFiles,
        });
      }

      // Store the created post ID and mark post creation as completed
      if (createdPost?.id) {
        setCreatedPostId(createdPost.id);
        setPostCreationCompleted(true);
        toast.success("Post created successfully! You can now add an itinerary.");
        setActiveTab("itinerary");
      }
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

  const categoryTree = categoriesResponse?.data || [];

  const handleTabChange = (key: string) => {
    if (key === "itinerary" && !createdPostId) {
      toast.error("Please create a post first before adding an itinerary");
      setActiveTab("post");
      return;
    }
    setActiveTab(key);
  };

  const handleSkipItinerary = () => {
    toast.success("Post created successfully!");
    onClose();
  };

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

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={
              <Space>
                <FileTextOutlined />
                Post Details
              </Space>
            } 
            key="post"
          >
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
                  <PictureOutlined /> Post Images (Max 10)
                </Space>
              </Divider>

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
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {previewUrls.map((url, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          position: 'relative',
                          width: '104px',
                          height: '104px',
                          border: '1px solid #d9d9d9',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}
                      >
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                        
                        <div 
                          style={{ 
                            position: 'absolute', 
                            bottom: 0, 
                            left: 0, 
                            right: 0,
                            background: 'rgba(0,0,0,0.65)', 
                            padding: '4px', 
                            display: 'flex', 
                            justifyContent: 'space-around' 
                          }}
                        >
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<EyeOutlined style={{ color: 'white' }} />}
                            onClick={() => handlePreview(url)}
                          />
                          <Button 
                            type="text" 
                            size="small" 
                            icon={<DeleteOutlined style={{ color: 'white' }} />}
                            onClick={() => removeFile(index)}
                          />
                        </div>
                        
                        {index === 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              background: 'rgba(0,132,255,0.75)',
                              color: 'white',
                              padding: '2px 6px',
                              fontSize: '12px',
                            }}
                          >
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <Text type="secondary">
                      First image will be used as the cover image. You can upload up to {10 - selectedFiles.length} more images.
                    </Text>
                  </div>
                )}
              </Form.Item>

              <Modal
                visible={previewVisible}
                title="Image Preview"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <img alt="Preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>

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
                    {postCreationCompleted ? "Update Post" : "Create Post"}
                  </Button>
                  <Button onClick={onClose} disabled={formSubmitting}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane 
            tab={
              <Space>
                <CalendarOutlined />
                Itinerary
                {!createdPostId && <span style={{ color: 'red' }}>*</span>}
              </Space>
            } 
            key="itinerary"
            disabled={!createdPostId}
          >
            {createdPostId ? (
              <>
                <Alert
                  message="Post Created Successfully"
                  description="Your post has been created. Now you can add an itinerary to your post."
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                
                <CreateItineraryForm 
                  postId={createdPostId} 
                  onSuccess={handleItinerarySuccess}
                />
                
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                  <Button onClick={handleSkipItinerary}>
                    Skip Itinerary
                  </Button>
                </div>
              </>
            ) : (
              <Alert
                message="Create Post First"
                description="Please create a post before adding an itinerary."
                type="warning"
                showIcon
              />
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CreatePostForm;