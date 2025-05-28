// components/CreatorRequestComponent.tsx
"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Card,
  Badge,
  Timeline,
  Typography,
  Space,
  Empty,
  Spin,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  StarOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useCreatorRequest } from "../hooks/useCreatorRequest";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface CreatorRequestProps {
  isOpen: boolean;
  onClose: () => void;
  isCreator: boolean;
}

interface CreatorRequest {
  id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: {
    username: string;
  };
}

const CreatorRequestComponent: React.FC<CreatorRequestProps> = ({
  isOpen,
  onClose,
  isCreator,
}) => {
  const [form] = Form.useForm();
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  const { useGetUserCreatorRequests, useCreateCreatorRequest } = useCreatorRequest();
  const { data: requestsData, isLoading } = useGetUserCreatorRequests();
  const createRequestMutation = useCreateCreatorRequest();

  const requests: CreatorRequest[] = requestsData?.data || [];
  const hasPendingRequest = requests.some(req => req.status === "pending");

  const handleSubmitRequest = (values: { reason: string }) => {
    createRequestMutation.mutate(values, {
      onSuccess: () => {
        form.resetFields();
        setShowRequestForm(false);
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "processing";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined />;
      case "approved":
        return <CheckCircleOutlined />;
      case "rejected":
        return <CloseCircleOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <StarOutlined className="text-yellow-500" />
          <span>Creator Request</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="creator-request-modal"
    >
      <div className="space-y-6">
        {/* Status Alert */}
        {isCreator ? (
          <Alert
            message="Congratulations!"
            description="You are already a creator. You can start creating and publishing content."
            type="success"
            icon={<CheckCircleOutlined />}
            className="rounded-lg"
          />
        ) : hasPendingRequest ? (
          <Alert
            message="Request Pending"
            description="Your creator request is currently being reviewed. Please wait for admin approval."
            type="info"
            icon={<ClockCircleOutlined />}
            className="rounded-lg"
          />
        ) : (
          <Alert
            message="Become a Creator"
            description="Submit a request to become a creator and start sharing your content with the community."
            type="info"
            icon={<StarOutlined />}
            className="rounded-lg"
          />
        )}

        {/* Request Form Section */}
        {!isCreator && !hasPendingRequest && (
          <Card 
            title={
              <div className="flex items-center gap-2">
                <SendOutlined className="text-blue-500" />
                <span>Submit Creator Request</span>
              </div>
            }
            className="shadow-sm"
          >
            {!showRequestForm ? (
              <div className="text-center py-6">
                <StarOutlined className="text-6xl text-yellow-400 mb-4" />
                <Title level={4} className="mb-2">Ready to Become a Creator?</Title>
                <Paragraph className="text-gray-600 mb-6 max-w-md mx-auto">
                  Share your passion, connect with your audience, and start earning. 
                  Tell us why you want to join our creator community.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<FileTextOutlined />}
                  onClick={() => setShowRequestForm(true)}
                  className="px-8"
                >
                  Start Application
                </Button>
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitRequest}
                className="max-w-2xl mx-auto"
              >
                <Form.Item
                  label={
                    <span className="text-base font-medium">
                      Why do you want to become a creator?
                    </span>
                  }
                  name="reason"
                  rules={[
                    { required: true, message: "Please provide your reason" },
                    { min: 20, message: "Reason must be at least 20 characters long" },
                  ]}
                  extra="Tell us about your content plans, experience, and what makes you unique (minimum 20 characters)"
                >
                  <TextArea
                    rows={6}
                    placeholder="I want to become a creator because..."
                    className="text-base"
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    onClick={() => {
                      setShowRequestForm(false);
                      form.resetFields();
                    }}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={createRequestMutation.isPending}
                    icon={<SendOutlined />}
                  >
                    Submit Request
                  </Button>
                </div>
              </Form>
            )}
          </Card>
        )}

        {/* Request History */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <FileTextOutlined className="text-blue-500" />
              <span>Request History</span>
              {requests.length > 0 && (
                <Badge count={requests.length} className="ml-2" />
              )}
            </div>
          }
          className="shadow-sm"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : requests.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No requests submitted yet"
              className="py-8"
            />
          ) : (
            <Timeline
              className="mt-4"
              items={requests.map((request) => ({
                dot: getStatusIcon(request.status),
                color: getStatusColor(request.status),
                children: (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Tag color={getStatusColor(request.status)} className="text-sm">
                          {getStatusText(request.status)}
                        </Tag>
                        <Text type="secondary" className="text-sm">
                          <CalendarOutlined className="mr-1" />
                          {moment(request.createdAt).format("MMM DD, YYYY HH:mm")}
                        </Text>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Text strong className="block mb-2">Your Request:</Text>
                      <Paragraph className="mb-0 text-gray-700">
                        {request.reason}
                      </Paragraph>
                    </div>

                    {request.adminNote && (
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                        <div className="flex items-center gap-2 mb-2">
                          <UserOutlined className="text-blue-500" />
                          <Text strong className="text-blue-700">
                            Admin Response
                            {request.reviewedBy && ` by ${request.reviewedBy.username}`}
                          </Text>
                        </div>
                        <Paragraph className="mb-0 text-blue-700">
                          {request.adminNote}
                        </Paragraph>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <Alert
                        message="Your request is being reviewed"
                        description="We'll notify you once an admin reviews your application."
                        type="info"
                        showIcon
                        className="mt-3"
                      />
                    )}
                  </div>
                ),
              }))}
            />
          )}
        </Card>
      </div>
    </Modal>
  );
};

export default CreatorRequestComponent;