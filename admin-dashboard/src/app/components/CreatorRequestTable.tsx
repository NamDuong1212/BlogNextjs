"use client"
import React, { useState } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Card,
  Typography,
  Descriptions,
  Avatar,
  Spin
} from "antd";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { useCreatorRequests } from "../hooks/useCreatorRequests";
import { toast } from "react-hot-toast";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CreatorRequest {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  adminNote?: string;
  reviewedBy?: {
    id: string;
    username: string;
  };
}

const CreatorRequestTable: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<CreatorRequest | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { useGetAllCreatorRequests, useReviewCreatorRequest } = useCreatorRequests();
  const { data: requestsResponse, isLoading } = useGetAllCreatorRequests();
  const { mutateAsync: reviewRequest, isPending: isReviewing } = useReviewCreatorRequest();

  const handleReview = (request: CreatorRequest) => {
    setSelectedRequest(request);
    setReviewModalVisible(true);
    form.resetFields();
  };

  const handleViewDetails = (request: CreatorRequest) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const onReviewSubmit = async (values: any) => {
    if (!selectedRequest) return;

    try {
      await reviewRequest({
        id: selectedRequest.id,
        data: values
      });
      setReviewModalVisible(false);
      setSelectedRequest(null);
      form.resetFields();
    } catch (error) {
      console.error("Review error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (record: CreatorRequest) => (
        <Space>
          <Avatar src={record.user.avatar} size="small">
            {record.user.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div>{record.user.username}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.user.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (text: string) => (
        <div style={{ maxWidth: '200px' }}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Review Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: 'Reviewed By',
      key: 'reviewedBy',
      render: (record: CreatorRequest) => 
        record.reviewedBy ? record.reviewedBy.username : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CreatorRequest) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Details
          </Button>
          {record.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleReview(record)}
            >
              Review
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Table
          columns={columns}
          dataSource={requestsResponse?.data || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      {/* Review Modal */}
      <Modal
        title="Review Creator Request"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          setSelectedRequest(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <div>
            <Descriptions column={1} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="User">
                <Space>
                  <Avatar src={selectedRequest.user.avatar} size="small">
                    {selectedRequest.user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  {selectedRequest.user.username} ({selectedRequest.user.email})
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                {selectedRequest.reason}
              </Descriptions.Item>
              <Descriptions.Item label="Request Date">
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            <Form
              form={form}
              layout="vertical"
              onFinish={onReviewSubmit}
            >
              <Form.Item
                name="status"
                label="Decision"
                rules={[{ required: true, message: "Please select a decision" }]}
              >
                <Select placeholder="Select decision">
                  <Select.Option value="approved">
                    <Space>
                      <CheckOutlined style={{ color: 'green' }} />
                      Approve
                    </Space>
                  </Select.Option>
                  <Select.Option value="rejected">
                    <Space>
                      <CloseOutlined style={{ color: 'red' }} />
                      Reject
                    </Space>
                  </Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="adminNote"
                label="Admin Note"
                rules={[{ required: true, message: "Please provide a note for your decision" }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Provide feedback or reason for your decision..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isReviewing}
                  >
                    Submit Review
                  </Button>
                  <Button
                    onClick={() => {
                      setReviewModalVisible(false);
                      setSelectedRequest(null);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Creator Request Details"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedRequest(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedRequest && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="User Information">
              <Space>
                <Avatar src={selectedRequest.user.avatar}>
                  {selectedRequest.user.username.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <div><strong>{selectedRequest.user.username}</strong></div>
                  <div>{selectedRequest.user.email}</div>
                </div>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Request Reason">
              {selectedRequest.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(selectedRequest.status)}>
                {selectedRequest.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Request Date">
              {new Date(selectedRequest.createdAt).toLocaleString()}
            </Descriptions.Item>
            {selectedRequest.reviewedAt && (
              <Descriptions.Item label="Review Date">
                {new Date(selectedRequest.reviewedAt).toLocaleString()}
              </Descriptions.Item>
            )}
            {selectedRequest.reviewedBy && (
              <Descriptions.Item label="Reviewed By">
                {selectedRequest.reviewedBy.username}
              </Descriptions.Item>
            )}
            {selectedRequest.adminNote && (
              <Descriptions.Item label="Admin Note">
                {selectedRequest.adminNote}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CreatorRequestTable;