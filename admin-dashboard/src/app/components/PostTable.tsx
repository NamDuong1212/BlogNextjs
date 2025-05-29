import React from "react";
import { Table, Button, Space, Modal, Input } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { usePosts } from "../hooks/usePost";
import dayjs from "dayjs";

const { confirm } = Modal;
const { TextArea } = Input;

interface PostType {
  key: string;
  _id: string;
  title: string;
  content: string;
  viewCount: number;
  category: string;
  user: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const PostTable: React.FC = () => {
  const { useGetPosts, useDeletePost } = usePosts();
  const { data: postsResponse, isLoading } = useGetPosts();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const [modal, contextHolder] = Modal.useModal();

  const handleDelete = (record: PostType) => {
    let reason = '';
    
    modal.confirm({
      title: "Delete Post",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Are you sure you want to delete "{record.title}"?</p>
          <p>The author will be notified with the reason below:</p>
          <TextArea
            placeholder="Enter reason for deletion (required)"
            rows={3}
            onChange={(e) => reason = e.target.value}
            style={{ marginTop: 8 }}
          />
        </div>
      ),
      okText: "Delete Post",
      okType: "danger",
      cancelText: "Cancel",
      width: 500,
      onOk() {
        if (!reason.trim()) {
          modal.error({
            title: "Reason Required",
            content: "Please provide a reason for deleting this post.",
          });
          return Promise.reject();
        }

        deletePost({
          id: record._id,
          userId: record.userId,
          title: record.title,
          reason: reason.trim(),
        });
      },
    });
  };

  const columns: TableColumnsType<PostType> = [
    { title: "ID", dataIndex: "_id", key: "_id", width: 100 },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Views",
      dataIndex: "viewCount",
      key: "viewCount",
      sorter: (a, b) => a.viewCount - b.viewCount,
      width: 80,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ellipsis: true,
      width: 150,
    },
    {
      title: "Author",
      dataIndex: "user",
      key: "user",
      width: 120,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
      width: 150,
    },
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            loading={isDeleting}
            title="Delete post with reason"
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
      category: post.categoryHierarchy.map((cat: any) => cat.name).join(" > "),
      user: post.user.username,
      userId: post.user.id || post.user._id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    })) || [];

  return (
    <div>
      {contextHolder}
      <Table<PostType>
        columns={columns}
        dataSource={data}
        loading={isLoading}
        expandable={{
          expandedRowRender: (record) => (
            <div
              style={{ margin: 0, padding: "16px", backgroundColor: "#fafafa" }}
            >
              <strong>Content:</strong>
              <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {record.content}
              </p>
            </div>
          ),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} posts`,
        }}
        rowKey="_id"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default PostTable;