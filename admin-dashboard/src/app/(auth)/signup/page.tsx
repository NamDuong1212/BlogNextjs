"use client";
import React from "react";
import Link from "next/link";
import { Form, Input, Button, Card, Space } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { validateRegister } from "../../utils/validation";
import { RegisterState } from "../../types/auth";

const Signup: React.FC = () => {
  const { registerMutation } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterState): Promise<void> => {
    const validationError = validateRegister(values);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="x-auto px-4 py-8">
      <Card
        title={<h2 className="text-center text-2xl font-bold">Sign Up</h2>}
        className="max-w-md mx-auto"
      >
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
              loading={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Signing up..." : "Sign Up"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Space>
              <span>Already a user?</span>
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Login
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
