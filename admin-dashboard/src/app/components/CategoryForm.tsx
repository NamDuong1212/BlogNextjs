import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useCategories } from "../hooks/useCategories";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

export const CategoryForm: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { useCreateCategory } = useCategories();
  const { mutateAsync, isPending } = useCreateCategory();

  const onFinish = async (values: any) => {
    try {
      await mutateAsync(values);
      form.resetFields();
      router.push("/");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Card title="Create Category" style={{ maxWidth: 800, margin: "0 auto" }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input category name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input category description" }]}
        >
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategoryForm;
