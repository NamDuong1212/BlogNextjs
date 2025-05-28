"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Divider,
  Badge,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GlobalOutlined,
  LoginOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { validateLogin } from "../../utils/validation";
import { LoginState } from "../../types/auth";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const router = useRouter();
  const { loginMutation } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (values: LoginState): Promise<void> => {
    const validationError = validateLogin(values);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    loginMutation.mutate(values);
  };

  // Mảng các hình ảnh du lịch nổi bật từ URL mạng
  const travelImages = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // beach
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // mountain
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98", // city
    "https://plus.unsplash.com/premium_photo-1671148858788-15bdf92b43ac?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  return (
    <div className="mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"></div>
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="World Map"
          layout="fill"
          style={{ objectFit: "cover" }}
          className="opacity-30"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl w-full mx-auto z-10">
        <Row gutter={48} className="items-center">
          {/* Left side - Travel Images Carousel */}
          <Col xs={0} sm={0} md={12} className="hidden md:block">
            <div className="relative h-[550px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/80 z-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Travel Experiences"
                fill
                style={{ objectFit: "cover" }}
                className="transition-all duration-700 hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white">
                <Text className="text-gray-100 opacity-90">
                  Join thousands of travelers sharing their experiences around
                  the world.
                </Text>
              </div>

              {/* Small circular image previews */}
              <div className="absolute top-8 right-8 z-20 flex space-x-2">
                {travelImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg"
                  >
                    <Image
                      src={img}
                      alt={`Travel spot ${index + 1}`}
                      fill // 👈 dùng fill để bao toàn bộ container
                      style={{ objectFit: "cover" }} // 👈 giúp ảnh không bị méo
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Right side - Login Form */}
          <Col xs={24} sm={24} md={12}>
            <div className="text-center mb-6">
              <Title level={2} className="mb-2 text-indigo-800 font-bold">
                <GlobalOutlined className="mr-2 text-purple-600" />
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  TripTales
                </span>
              </Title>
              <Text className="text-gray-600 text-lg">
                Sign in to access your account and explore our content
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
                  <LoginOutlined className="mr-2 text-indigo-600" />
                  Account Login
                </Title>
              </div>

              <Form
                form={form}
                name="login"
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
                    prefix={<UserOutlined className="text-indigo-500" />}
                    placeholder="Email"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password!" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-indigo-500" />}
                    placeholder="Password"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-6 rounded-full shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-medium text-lg h-auto"
                    loading={loginMutation.isPending}
                    icon={<SafetyOutlined />}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>

                <Divider className="my-6">
                  <Badge color="#4F46E5" />
                  <Badge color="#9333EA" className="mx-2" />
                  <Badge color="#4F46E5" />
                </Divider>

                <div className="text-center">
                  {/* Forgot password link - đặt trước register section */}
                  <div className="mb-4 text-center">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Register section */}
                  <Space>
                    <Text className="text-gray-600">
                      Don't have an account?
                    </Text>
                    <Link
                      href="/register"
                      className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
                    >
                      Register Now
                    </Link>
                  </Space>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
