import React, { useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import { useCategories } from "../hooks/useCategories";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

interface CategoryFormProps {
  initialValues?: any;
  onSuccess?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSuccess,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { useCreateCategory, useUpdateCategory } = useCategories();
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateCategory(onSuccess);
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateCategory(onSuccess);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const onFinish = async (values: any) => {
    try {
      if (initialValues?._id) {
        await updateCategory({ id: initialValues._id, data: values });
      } else {
        await createCategory(values);
      }
      form.resetFields();
      router.push("/category");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card
      title={initialValues ? "Edit Category" : "Create Category"}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
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
          rules={[
            { required: true, message: "Please input category description" },
          ]}
        >
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
          >
            {initialValues ? "Update" : "Create"} Category
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategoryForm;
