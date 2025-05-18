import React from "react";
import { Table, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { usePosts } from "../hooks/usePost";
import dayjs from "dayjs";

interface PostType {
  key: string;
  _id: string;
  title: string;
  content: string;
  viewCount: number;
  category: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

const PostTable: React.FC = () => {
  const { useGetPosts, useDeletePost } = usePosts();
  const { data: postsResponse, isLoading } = useGetPosts();
  const { mutate: deletePost } = useDeletePost();

  const handleDelete = (id: string) => {
    deletePost(id);
  };

  const columns: TableColumnsType<PostType> = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Views",
      dataIndex: "viewCount",
      key: "viewCount",
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Author", dataIndex: "user", key: "user" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) =>
        dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) =>
        dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      render: (date: string) =>
        dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
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

  const data: PostType[] =
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
      <Table<PostType>
        columns={columns}
        dataSource={data}
        loading={isLoading}
        expandable={{
          expandedRowRender: (record) => (
            <p style={{ margin: 0 }}>{record.content}</p>
          ),
        }}
        pagination={{ pageSize: 10 }}
        rowKey="_id"
      />
    </div>
  );
};

export default PostTable;
