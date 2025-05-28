"use client";
import React from "react";
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
} from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
  SafetyOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";

const { Title, Text } = Typography;

interface ForgotPasswordValues {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const { forgotPasswordMutation } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: ForgotPasswordValues): Promise<void> => {
    forgotPasswordMutation.mutate(values);
  };

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
                Reset your password
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
                  <MailOutlined className="mr-2 text-indigo-600" />
                  Forgot Password
                </Title>
              </div>

              <div className="mb-6">
                <Text className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </Text>
              </div>

              <Form
                form={form}
                name="forgotPassword"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-indigo-500" />}
                    placeholder="Enter your email address"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-6 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-medium text-lg h-auto mb-4"
                    loading={forgotPasswordMutation.isPending}
                    icon={<SafetyOutlined />}
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;