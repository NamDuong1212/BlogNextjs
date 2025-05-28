import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Card,
  Tag,
  Avatar,
  Modal,
  Form,
  Switch,
  Select,
  Popconfirm,
  Typography,
  Tooltip,
  Badge,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CrownOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useUser } from "../hooks/useUser";
import { User , UpdateCreatorStatusDto} from "@/app/types/user";
import { toast } from "react-hot-toast";

const { Text, Title } = Typography;
const { Option } = Select;

const UserManagementTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { 
    useGetAllUsers, 
    useUpdateCreatorStatus, 
    useDeleteUser 
  } = useUser();

  const { data: usersResponse, isLoading } = useGetAllUsers();
  const { mutate: updateCreatorStatus, isPending: isUpdating } = 
    useUpdateCreatorStatus(() => {
      setIsModalVisible(false);
      form.resetFields();
    });
  const { mutate: deleteUser } = useDeleteUser();

  const users: User[] = usersResponse?.data || [];

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      isCreator: user.isCreator,
      reason: "",
    });
    setIsModalVisible(true);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();
      const updateData: UpdateCreatorStatusDto = {
        isCreator: values.isCreator,
        reason: values.reason || undefined,
      };

      updateCreatorStatus({
        userId: selectedUser.id,
        updateData,
      });
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  const filterData = (data: User[]): User[] => {
    return data.filter((user) => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = 
        filterRole === "all" ||
        (filterRole === "creator" && user.isCreator) ||
        (filterRole === "user" && !user.isCreator) ||
        (filterRole === "admin" && user.role === "admin");

      return matchesSearch && matchesRole;
    });
  };

  const columns: TableColumnsType<User> = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.role === "admin" && (
            <Tag color="red" icon={<CrownOutlined />}>
              Admin
            </Tag>
          )}
          {record.isCreator ? (
            <Tag color="gold" icon={<CrownOutlined />}>
              Creator
            </Tag>
          ) : (
            <Tag color="blue" icon={<UserOutlined />}>
              User
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Badge 
          status={isActive ? "success" : "error"} 
          text={isActive ? "Active" : "Inactive"} 
        />
      ),
    },
    {
      title: "Statistics",
      key: "stats",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text style={{ fontSize: 12 }}>
            Posts: <strong>{record.postsCount}</strong>
          </Text>
          {record.isCreator && (
            <Text style={{ fontSize: 12 }}>
              <WalletOutlined /> Balance: <strong>${record.walletBalance}</strong>
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.role !== "admin" && (
            <Tooltip title="Edit Role">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditRole(record)}
              />
            </Tooltip>
          )}
          {record.role !== "admin" && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user? This action cannot be undone."
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete User">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Title level={3}>User Management</Title>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginTop: 16,
            gap: 16,
            flexWrap: "wrap"
          }}>
            <Space>
              <Input.Search
                placeholder="Search users by name or email..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Filter by role"
                value={filterRole}
                onChange={setFilterRole}
                style={{ width: 150 }}
              >
                <Option value="all">All Roles</Option>
                <Option value="admin">Admin</Option>
                <Option value="creator">Creator</Option>
                <Option value="user">User</Option>
              </Select>
            </Space>
          </div>
        </div>

        <Table<User>
          columns={columns}
          dataSource={filterData(users)}
          loading={isLoading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} users`
          }}
          rowKey="id"
        />
      </Card>

      {/* Role Edit Modal */}
      <Modal
        title={`Edit Role - ${selectedUser?.username}`}
        open={isModalVisible}
        onOk={handleUpdateRole}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        confirmLoading={isUpdating}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="isCreator"
            label="Creator Status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Creator"
              unCheckedChildren="User"
            />
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.isCreator !== currentValues.isCreator
            }
          >
            {({ getFieldValue }) => {
              const isCreator = getFieldValue('isCreator');
              const wasCreator = selectedUser?.isCreator;
              
              // Show reason field when revoking creator status
              if (wasCreator && !isCreator) {
                return (
                  <Form.Item
                    name="reason"
                    label="Reason for Revoking Creator Status"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a reason for revoking creator status",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Explain why creator status is being revoked..."
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* User Details Modal */}
      <Modal
        title={`User Details - ${selectedUser?.username}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedUser && (
          <div style={{ padding: "20px 0" }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <Avatar 
                  src={selectedUser.avatar} 
                  icon={<UserOutlined />}
                  size={80}
                />
                <Title level={4} style={{ margin: "10px 0 5px" }}>
                  {selectedUser.username}
                </Title>
                <Text type="secondary">{selectedUser.email}</Text>
              </div>

              <div>
                <Title level={5}>Basic Information</Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div><strong>Bio:</strong> {selectedUser.bio || "No bio provided"}</div>
                  <div><strong>Birthday:</strong> {selectedUser.birthday || "Not specified"}</div>
                  <div><strong>Role:</strong> {selectedUser.role}</div>
                  <div><strong>Creator Status:</strong> {selectedUser.isCreator ? "Yes" : "No"}</div>
                  <div><strong>Account Status:</strong> {selectedUser.isActive ? "Active" : "Inactive"}</div>
                </Space>
              </div>

              <div>
                <Title level={5}>Statistics</Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div><strong>Posts Count:</strong> {selectedUser.postsCount}</div>
                  {selectedUser.likesCount !== undefined && (
                    <div><strong>Likes Count:</strong> {selectedUser.likesCount}</div>
                  )}
                  {selectedUser.reportsCount !== undefined && (
                    <div><strong>Reports Count:</strong> {selectedUser.reportsCount}</div>
                  )}
                  {selectedUser.isCreator && (
                    <div><strong>Wallet Balance:</strong> ${selectedUser.walletBalance}</div>
                  )}
                </Space>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementTable;