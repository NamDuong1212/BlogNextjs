"use client";
import React from "react";
import { Form, Input, Select, Button, Card, Spin } from "antd";
import useAuthStore from "@/app/store/useAuthStore";
import { usePost } from "@/app/hooks/usePost";
import { Post } from "@/app/types/post";
const { TextArea } = Input;
const { Option } = Select;

interface PostFormProps {
  post?: Post;
  onSuccess?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ post, onSuccess }) => {
  const [form] = Form.useForm();
  const { userData } = useAuthStore();
  const { useGetCategories, useCreatePost, useUpdatePost } = usePost();
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategories();
  const createMutation = useCreatePost(onSuccess);
  const updateMutation = useUpdatePost(onSuccess);

  const onFinish = (values: any) => {
    const dataToSubmit = {
      ...values,
      author: userData?.username,
    };

    if (post?.id) {
      updateMutation.mutate({ id: post.id, ...dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  React.useEffect(() => {
    form.setFieldValue("author", userData?.username);
  }, [userData]);

  return (
    <Card
      title={post ? "Edit Post" : "Create Post"}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          author: userData?.username,
          title: post?.title || "",
          content: post?.content || "",
          categoryId: post?.categoryId || undefined,
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
          name="categoryIds"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          {isCategoriesLoading ? (
            <Spin />
          ) : (
            <Select placeholder="Select a category">
              {categories?.map((category: { id: number | string; name: string }) => (
                <Option key={category.id.toString()} value={category.id.toString()}>
                  {category.name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>


        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {post ? "Update" : "Create"} Post
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostForm;
