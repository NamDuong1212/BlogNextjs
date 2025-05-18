import React, { useState } from "react";
import { Table, Button, Modal, Space, Input, Card } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useCategories } from "../hooks/useCategories";
import CategoryForm from "./CategoryForm";

export interface CategoryType {
  key?: string;
  _id?: string;
  name?: string;
  description?: string;
  level?: number;
  parent?: Partial<CategoryType>;
  children?: CategoryType[];
}

const CategoryTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { useGetCategories, useDeleteCategory } = useCategories();
  const { data: categoriesResponse, isLoading } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };

  const handleCreateSubcategory = (category: CategoryType) => {
    setEditingCategory({ parent: { _id: category._id, name: category.name } });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
  };

  const mapCategories = (categories: any[]): CategoryType[] => {
    return categories.map((category) => ({
      key: category.id,
      _id: category.id,
      name: category.name,
      description: category.description,
      level: category.level,
      parent: category.parent,
      children: category.children ? mapCategories(category.children) : [],
    }));
  };

  const data = categoriesResponse?.data ? mapCategories(categoriesResponse.data) : [];

  const filterData = (data: CategoryType[]): CategoryType[] => {
    return data.filter((category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns: TableColumnsType<CategoryType> = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        // Increase marginLeft to indent based on level
        <div style={{ marginLeft: record.level && record.level > 1 ? (record.level - 1) * 40 : 0 }}>
          <span style={{ fontWeight: 500 }}>{record.name}</span>
          {record.parent && (
            <div style={{ fontSize: "0.85em", color: "#888" }}>
              {/* Optionally show parent category name here */}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (level: number) => (
        <span style={{ marginLeft: (level - 1) * 40 }}>{level}</span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => record._id && handleDelete(record._id)}
          />
          {/* Only show subcategory button if level is less than 4 */}
          {record.level && record.level < 4 && (
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => handleCreateSubcategory(record)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Input.Search
            placeholder="Search categories"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              setIsModalVisible(true);
            }}
          >
            Add New Category
          </Button>
        </div>
        <Table<CategoryType>
          columns={columns}
          dataSource={filterData(data)}
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </Card>

      <Modal
        title={editingCategory && editingCategory._id ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <CategoryForm initialValues={editingCategory} onSuccess={handleModalClose} />
      </Modal>
    </div>
  );
};

export default CategoryTable;
