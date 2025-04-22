import React, { useEffect } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import { useCategories } from "../hooks/useCategories";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

interface CategoryFormProps {
  initialValues?: any;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialValues, onSuccess }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { useCreateCategory, useUpdateCategory, useGetCategories } = useCategories();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory(onSuccess);
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory(onSuccess);
  const { data: categoriesResponse } = useGetCategories();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        parentId: initialValues.parent?.id || initialValues.parent?._id,
      });
    }
  }, [initialValues, form]);

  // Hàm đệ quy để flatten danh mục cho Select
  const flattenCategories = (categories: any[], parentId?: string): any[] => {
    return categories.reduce((acc: any[], category: any) => {
      // Bỏ qua category đang chỉnh sửa và các con của nó
      if (category.id === initialValues?._id) {
        return acc;
      }
      acc.push({
        id: category.id,
        name: category.name,
        parentId: parentId,
      });
      if (category.children?.length > 0) {
        acc.push(...flattenCategories(category.children, category.id));
      }
      return acc;
    }, []);
  };

  const availableParentCategories = categoriesResponse?.data
    ? flattenCategories(categoriesResponse.data)
    : [];

  const onFinish = async (values: any) => {
    try {
      if (initialValues && initialValues._id) {
        await updateCategory({ id: initialValues._id, data: values });
      } else {
        await createCategory(values);
      }
      form.resetFields();
      router.push("/category");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Card
      title={initialValues && initialValues._id ? "Sửa danh mục" : "Tạo danh mục"}
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Hãy điền tên danh mục" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="parentId" label="Danh mục cha">
          <Select
            allowClear
            placeholder="Hãy chọn danh mục cha"
            disabled
            options={availableParentCategories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Hãy điền mô tả cho danh mục" }]}
        >
          <TextArea rows={5} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
            {initialValues && initialValues._id ? "Sửa đổi" : "Tạo"} danh mục
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CategoryForm;
