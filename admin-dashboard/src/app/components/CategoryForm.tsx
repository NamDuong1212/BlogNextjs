import React from 'react';
import { Form, Input, Button } from 'antd';
import { CategoryFormData } from '../types/category';

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  initialData,
  isLoading
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values: CategoryFormData) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialData}
      className="max-w-lg"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input the category name!',
          },
        ]}
      >
        <Input placeholder="Enter category name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: 'Please input the category description!',
          },
        ]}
      >
        <Input.TextArea
          placeholder="Enter category description"
          rows={4}
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          className="w-full"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;