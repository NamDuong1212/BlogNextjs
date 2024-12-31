"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, Space } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { validateRegister } from "../../utils/validation";
import { RegisterState } from "../../types/auth";

const Register: React.FC = () => {
  const router = useRouter();
  const { registerMutation, verifyOtpMutation } = useAuth();
  const [form] = Form.useForm();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleSubmit = async (values: RegisterState): Promise<void> => {

    const validationError = validateRegister(values);
    if (validationError) {
      toast.error(validationError, { autoClose: 2000 });
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
      setRegisteredEmail(values.email);
      setShowOtpForm(true);
      toast.success("Please check your email for OTP verification code", {
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleOtpSubmit = async (values: { otp: string }): Promise<void> => {
    try {
      await verifyOtpMutation.mutateAsync({
        email: registeredEmail,
        otp: values.otp,
      });
      toast.success("Account verified successfully!", {
        autoClose: 2000,
        onClose: () => router.push("/login"),
      });
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
    }
  };

  if (showOtpForm) {
    return (
      <div className="x-auto px-4 py-8">
        <Card
          title={<h2 className="text-center text-2xl font-bold">Verify OTP</h2>}
          className="max-w-md mx-auto"
        >
          <p className="text-center mb-4">
            An OTP has been sent to {registeredEmail}
          </p>
          <Form
            form={form}
            name="verifyOtp"
            onFinish={handleOtpSubmit}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="otp"
              rules={[
                { required: true, message: "Please input your OTP!" },
                { len: 6, message: "OTP must be exactly 6 digits!" },
              ]}
            >
              <Input
                prefix={<NumberOutlined />}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                loading={verifyOtpMutation.isPending}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

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
            name="username"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

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

export default Register;
