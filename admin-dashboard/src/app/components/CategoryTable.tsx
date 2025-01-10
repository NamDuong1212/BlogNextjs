import React, { useState } from "react";
import { Table, Button, Modal, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useCategories } from "../hooks/useCategories";
import CategoryForm from "./CategoryForm";

interface CategoryType {
  key: string;
  _id: string;
  name: string;
  description: string;
}

const CategoryTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const { useGetCategories, useDeleteCategory } = useCategories();
  const { data: categoriesResponse, isLoading } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const columns: TableColumnsType<CategoryType> = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const data =
    categoriesResponse?.data?.map((category: any) => ({
      key: category.id,
      _id: category.id,
      name: category.name,
      description: category.description,
    })) || [];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add Category
      </Button>

      <Table<CategoryType>
        columns={columns}
        dataSource={data}
        loading={isLoading}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.description}</p>
          ),
        }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <CategoryForm
          initialValues={editingCategory}
          onSuccess={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default CategoryTable;
