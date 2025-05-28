"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Alert,
} from "antd";
import {
  LockOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  GlobalOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

const { Title, Text } = Typography;

interface ResetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPasswordMutation } = useAuth();
  const [form] = Form.useForm();
  const [token, setToken] = useState<string>("");
  const [isValidToken, setIsValidToken] = useState<boolean>(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setIsValidToken(false);
      toast.error("Invalid reset link");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (values: ResetPasswordValues): Promise<void> => {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
  };

  if (!isValidToken) {
    return (
      <div className="mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"></div>
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Background"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-30"
          />
        </div>

        <div className="max-w-md w-full mx-auto z-10">
          <Card className="shadow-lg rounded-xl overflow-hidden border-none">
            <div className="text-center p-6">
              <div className="mb-4">
                <GlobalOutlined className="text-4xl text-red-500" />
              </div>
              <Title level={3} className="text-red-600 mb-4">
                Invalid Reset Link
              </Title>
              <Text className="text-gray-600 mb-6 block">
                This password reset link is invalid or has expired. Please request a new one.
              </Text>
              <Link href="/forgot-password">
                <Button 
                  type="primary" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 border-none hover:from-indigo-600 hover:to-purple-700"
                  size="large"
                >
                  Request New Reset Link
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"></div>
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full mx-auto z-10">
        <Row justify="center">
          <Col xs={24}>
            <div className="text-center mb-6">
              <Title level={2} className="mb-2 text-indigo-800 font-bold">
                <GlobalOutlined className="mr-2 text-purple-600" />
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  TripTales
                </span>
              </Title>
              <Text className="text-gray-600 text-lg">
                Set your new password
              </Text>
            </div>

            <Card
              className="shadow-lg rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300"
              styles={{
                body: { padding: "2rem" },
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-indigo-600 rounded-full mr-2"></div>
                <Title
                  level={4}
                  className="m-0 text-indigo-800 font-bold flex items-center"
                >
                  <LockOutlined className="mr-2 text-indigo-600" />
                  Reset Password
                </Title>
              </div>

              <div className="mb-6">
                <Alert
                  message="Password Requirements"
                  description="Your new password must be at least 6 characters long."
                  type="info"
                  showIcon
                  className="mb-4"
                />
              </div>

              <Form
                form={form}
                name="resetPassword"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter your new password!" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters long!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-indigo-500" />}
                    placeholder="Enter new password"
                    className="rounded-lg py-2"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['newPassword']}
                  rules={[
                    { required: true, message: "Please confirm your password!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-indigo-500" />}
                    placeholder="Confirm new password"
                    className="rounded-lg py-2"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-6 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-medium text-lg h-auto mb-4"
                    loading={resetPasswordMutation.isPending}
                    icon={<SafetyOutlined />}
                  >
                    {resetPasswordMutation.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </Form.Item>

                <div className="text-center">
                  <Space direction="vertical" size="middle" className="w-full">
                    <Link
                      href="/login"
                      className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center justify-center"
                    >
                      <ArrowLeftOutlined className="mr-1" />
                      Back to Login
                    </Link>
                    <div>
                      <Text className="text-gray-600 text-sm">
                        Remember your password?{" "}
                        <Link
                          href="/login"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Sign in
                        </Link>
                      </Text>
                    </div>
                  </Space>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;