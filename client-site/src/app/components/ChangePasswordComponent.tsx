// components/ChangePasswordModal.tsx
"use client";

import React from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Typography,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useAuth } from "../hooks/useAuth";
import { ChangePasswordRequest } from "../types/auth";

const { Text } = Typography;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { changePasswordMutation } = useAuth();

  const handleSubmit = (values: ChangePasswordRequest) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        form.resetFields();
        onClose();
      },
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-lg">
          <SafetyOutlined className="text-blue-500" />
          <span>Change Password</span>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={480}
      centered
      className="rounded-xl overflow-hidden"
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="pt-4"
        autoComplete="off"
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            { required: true, message: "Please enter your current password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your current password"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your new password"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Please confirm your new password" },
            { min: 6, message: "Password must be at least 6 characters long" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Confirm your new password"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <Text type="secondary" className="text-sm">
            <strong>Password Requirements:</strong>
            <ul className="mt-2 ml-4 list-disc">
              <li>At least 6 characters long</li>
              <li>Must be different from your current password</li>
              <li>Both new password fields must match</li>
            </ul>
          </Text>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleCancel}
            size="large"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={changePasswordMutation.isPending}
            className="flex-1"
          >
            Change Password
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;