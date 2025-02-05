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
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategories();
  const createMutation = useCreatePost();
  const uploadMutation = useUploadPostImage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

      const dataToSubmit = {
        userId: userData.id,
        title: values.title,
        content: values.content,
        categoryId: values.categoryId,
        tags: values.tags || [], // Add tags to submission
      };

      const createdPost = await createMutation.mutateAsync(dataToSubmit);

      if (selectedFile && createdPost?.id) {
        await uploadMutation.mutateAsync({
          id: createdPost.id,
          file: selectedFile,
        });
      }

      return router.push("/post-list");
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

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          {isCategoriesLoading ? (
            <Spin />
          ) : (
            <Select placeholder="Select a category">
              {categories?.map((category: { id: number | string; name: string }) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          help="Enter tags and press Enter to add"
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags"
            tokenSeparators={[',']}
          />
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
