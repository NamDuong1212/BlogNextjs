import React from "react";
import { Table, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { usePosts } from "../hooks/usePost";
import dayjs from "dayjs";

const PostTable: React.FC = () => {
  const { useGetPosts, useDeletePost } = usePosts();
  const { data: postsResponse, isLoading } = useGetPosts();
  const { mutate: deletePost } = useDeletePost();

  const columns: TableColumnsType = [
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Views",
      dataIndex: "viewCount",
      sorter: (a, b) => a.viewCount - b.viewCount,
      key: "viewCount",
    },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Author", dataIndex: "user", key: "user" },
    {
      title: "Created",
      dataIndex: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      key: "updatedAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
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

  const handleDelete = (id: string) => {
    deletePost(id);
  };

  const data =
  postsResponse?.data?.map((post: any) => ({
    key: post.id,
    _id: post.id,
    title: post.title,
    content: post.content,
    viewCount: post.viewCount,
    category: post.categoryHierarchy
      .map((cat: any) => cat.name)
      .join(" > "),
    user: post.user.username,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  })) || [];


  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={isLoading}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.content}</p>
          ),
        }}
      />
    </div>
  );
};

export default PostTable;
