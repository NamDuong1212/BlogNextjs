"use client";

import React from "react";
import { Card, Form, Input, Button, Space } from "antd";
import { useCategory } from "@/app/hooks/useCategory";
import { CreateCategoryType } from "@/app/types/category";

const CreateCategory = () => {
  const [form] = Form.useForm();
  const { createCategoryMutation } = useCategory();

  const handleSubmit = async (values: CreateCategoryType) => {
    try {
      await createCategoryMutation.mutateAsync(values);
      form.resetFields();
    } catch (error) {
      console.error("Submit Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card title="Create New Category" className="shadow-md rounded-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ isActive: true }}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[
                { required: true, message: "Please enter category name" },
                { min: 3, message: "Name must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea
                rows={4}
                placeholder="Enter category description"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createCategoryMutation.isPending}
                >
                  Create Category
                </Button>
                <Button
                  onClick={() => form.resetFields()}
                  disabled={createCategoryMutation.isPending}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCategory;
