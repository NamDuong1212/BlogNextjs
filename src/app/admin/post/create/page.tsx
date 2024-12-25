"use client";
import React from "react";
import { Form, Input, Select, Button, Card, Spin } from "antd";
import useAuthStore from "@/app/store/useAuthStore";
import { usePost } from "@/app/hooks/usePost";

const { TextArea } = Input;
const { Option } = Select;

export const CreatePostForm: React.FC = () => {
  const [form] = Form.useForm();
  const { userData } = useAuthStore();
  const { useGetCategories, useCreatePost } = usePost();
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategories();
  const createMutation = useCreatePost();

  const onFinish = (values: any) => {
    const dataToSubmit = {
      ...values,
      author: userData?.username,
    };
    createMutation.mutate(dataToSubmit);
  };

  React.useEffect(() => {
    form.setFieldValue("author", userData?.username);
  }, [userData]);

  return (
    <Card title="Create Post" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          author: userData?.username,
        }}
      >
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
              {categories?.map(
                (category: { id: number | string; name: string }) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ),
              )}
            </Select>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
          >
            Create Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreatePostForm;
