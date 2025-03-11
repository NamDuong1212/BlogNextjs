"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Card, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import useAuthStore from "@/app/store/useAuthStore";
import { usePost } from "@/app/hooks/usePost";
import { useRouter } from "next/navigation";

const { TextArea } = Input;
const { Option } = Select;

export const CreatePostForm: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { userData } = useAuthStore();
  const { useGetCategories, useCreatePost, useUploadPostImage } = usePost();
  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
  } = useGetCategories();
  const createMutation = useCreatePost();
  const uploadMutation = useUploadPostImage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Các state cho cascading dropdown (level 1 đến level 4)
  const [selectedLevel1, setSelectedLevel1] = useState<any>(null);
  const [selectedLevel2, setSelectedLevel2] = useState<any>(null);
  const [selectedLevel3, setSelectedLevel3] = useState<any>(null);
  const [selectedLevel4, setSelectedLevel4] = useState<any>(null);

  useEffect(() => {
    if (!userData?.isCreator) {
      router.replace("/");
    }
  }, [userData, router]);

  const onFinish = async (values: any) => {
    try {
      if (!userData?.id) {
        message.error("User ID is required");
        return;
      }
      if (!selectedLevel4 || !selectedLevel4.id) {
        message.error("Please select a category at level 4.");
        return;
      }

      const dataToSubmit = {
        userId: userData.id,
        title: values.title,
        content: values.content,
        // Chỉ khi đã có dữ liệu của level 4 mới truyền categoryId
        categoryId: selectedLevel4.id,
      };

      const createdPost = await createMutation.mutateAsync(dataToSubmit);

      if (selectedFile && createdPost?.id) {
        await uploadMutation.mutateAsync({
          id: createdPost.id,
          file: selectedFile,
        });
      }

      router.push("/post-list");
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Failed to create post");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }
    setSelectedFile(file);
    return false;
  };

  // Giả sử API trả về danh sách categories theo dạng cây trong categoriesResponse.data
  const categoryTree = categoriesResponse?.data || [];

  return (
    <Card title="Create Post" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Author">
          <Input value={userData?.username || ""} disabled />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input title" }]}
        >
          <TextArea rows={1} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please input content" }]}
        >
          <TextArea rows={5} />
        </Form.Item>

        {/* Cascading Dropdown cho Category */}
        <Form.Item label="Category" required>
          {isCategoriesLoading ? (
            <Spin />
          ) : (
            <>
              {/* Dropdown Level 1 */}
              <Select
                placeholder="Select level 1 category"
                style={{ marginBottom: 8 }}
                onChange={(value) => {
                  const selected = categoryTree.find((cat: any) => cat.id === value);
                  setSelectedLevel1(selected);
                  // Reset các cấp dưới
                  setSelectedLevel2(null);
                  setSelectedLevel3(null);
                  setSelectedLevel4(null);
                }}
                value={selectedLevel1?.id || undefined}
                allowClear
              >
                {categoryTree.map((cat: any) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>

              {/* Dropdown Level 2 */}
              {selectedLevel1 &&
                selectedLevel1.children &&
                selectedLevel1.children.length > 0 && (
                  <Select
                    placeholder="Select level 2 category"
                    style={{ marginBottom: 8 }}
                    onChange={(value) => {
                      const selected = selectedLevel1.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel2(selected);
                      setSelectedLevel3(null);
                      setSelectedLevel4(null);
                    }}
                    value={selectedLevel2?.id || undefined}
                    allowClear
                  >
                    {selectedLevel1.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}

              {/* Dropdown Level 3 */}
              {selectedLevel2 &&
                selectedLevel2.children &&
                selectedLevel2.children.length > 0 && (
                  <Select
                    placeholder="Select level 3 category"
                    style={{ marginBottom: 8 }}
                    onChange={(value) => {
                      const selected = selectedLevel2.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel3(selected);
                      setSelectedLevel4(null);
                    }}
                    value={selectedLevel3?.id || undefined}
                    allowClear
                  >
                    {selectedLevel2.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}

              {/* Dropdown Level 4 */}
              {selectedLevel3 &&
                selectedLevel3.children &&
                selectedLevel3.children.length > 0 && (
                  <Select
                    placeholder="Select level 4 category"
                    style={{ marginBottom: 8 }}
                    onChange={(value) => {
                      const selected = selectedLevel3.children.find(
                        (child: any) => child.id === value,
                      );
                      setSelectedLevel4(selected);
                    }}
                    value={selectedLevel4?.id || undefined}
                    allowClear
                  >
                    {selectedLevel3.children.map((child: any) => (
                      <Option key={child.id} value={child.id}>
                        {child.name}
                      </Option>
                    ))}
                  </Select>
                )}
            </>
          )}
        </Form.Item>

        <Form.Item label="Post Image" help="Upload an image for your post">
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept="image/*"
            fileList={
              selectedFile
                ? [
                    {
                      uid: "-1",
                      name: selectedFile.name,
                      status: "done",
                      url: URL.createObjectURL(selectedFile),
                    },
                  ]
                : []
            }
            onRemove={() => setSelectedFile(null)}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending || uploadMutation.isPending}
          >
            Create Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePostForm;
