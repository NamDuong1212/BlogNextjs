"use client";
import React, { useState } from "react";
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
  Steps,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  NumberOutlined,
  GlobalOutlined,
  TeamOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  CameraOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { validateRegister } from "../../utils/validation";
import { RegisterState } from "../../types/auth";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const Register: React.FC = () => {
  const router = useRouter();
  const { registerMutation, verifyOtpMutation } = useAuth();
  const [form] = Form.useForm();
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (values: RegisterState): Promise<void> => {
    const validationError = validateRegister(values);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
      setRegisteredEmail(values.email);
      setShowOtpForm(true);
      setCurrentStep(1);
      toast.success("Please check your email for the OTP verification code.", {
        icon: "📧",
        style: {
          borderRadius: "10px",
          background: "#4F46E5",
          color: "#fff",
        },
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
      setCurrentStep(2);
      toast.success("Account verified successfully!", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });

      // Redirect after a small delay to show success state
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
    }
  };

  // Danh sách các biểu tượng du lịch
  const travelIcons = [
    { icon: <CompassOutlined />, text: "Explore" },
    { icon: <EnvironmentOutlined />, text: "Discover" },
  ];

  const destinations = [
    {
      name: "Paris",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34", // Eiffel Tower
    },
    {
      name: "Tokyo",
      image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7", // Tokyo city
    },
    {
      name: "Bali",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", // Bali beach
    },
    {
      name: "New York",
      image:
        "https://images.unsplash.com/photo-1448317846460-907988886b33?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // NYC skyline
    },
  ];

  // Trang xác minh OTP
  if (showOtpForm) {
    return (
      <div className="mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200 via-indigo-200 to-blue-200"></div>
          <Image
            src="/images/world-map.svg"
            alt="World Map"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-40 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-2xl w-full mx-auto z-10">
          <div className="text-center mb-6">
            <Title level={2} className="mb-2 text-indigo-800 font-bold">
              <GlobalOutlined className="mr-2 text-purple-600" />{" "}
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                TripTales
              </span>
            </Title>
            <Text className="text-gray-600 text-lg">
              Complete your registration by entering the verification code
            </Text>
          </div>

          <Card className="shadow-lg rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300 mb-6">
            <Steps current={currentStep} className="px-4 py-6">
              <Step title="Register" icon={<UserOutlined />} />
              <Step title="Verify" icon={<SafetyOutlined />} />
              <Step title="Complete" icon={<CheckCircleOutlined />} />
            </Steps>
          </Card>

          <Row gutter={24}>
            <Col xs={24} sm={24} md={8} className="mb-6 md:mb-0">
              <div className="h-full rounded-xl overflow-hidden shadow-md relative">
                <Image
                  src="https://images.unsplash.com/photo-1746277121508-f44615ff09bb?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Email Verification"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex flex-col justify-end p-4">
                  <Text className="text-gray-200">Check your email inbox</Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={24} md={16}>
              <Card
                className="shadow-lg rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300"
                styles={{
                  body: { padding: "2rem" },
                }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-1 h-6 bg-purple-600 rounded-full mr-2"></div>
                  <Title
                    level={4}
                    className="m-0 text-purple-800 font-bold flex items-center"
                  >
                    <SafetyOutlined className="mr-2 text-purple-600" />
                    OTP Verification
                  </Title>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6 border-l-4 border-indigo-500">
                  <Paragraph className="text-indigo-700 mb-0">
                    <MailOutlined className="mr-2" />
                    The OTP code has been sent to{" "}
                    <strong>{registeredEmail}</strong>
                  </Paragraph>
                </div>

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
                      { required: true, message: "Please enter the OTP code!" },
                      {
                        len: 6,
                        message: "The OTP code must be exactly 6 characters!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<NumberOutlined className="text-purple-500" />}
                      placeholder="Enter the 6-digit OTP code"
                      maxLength={6}
                      className="rounded-lg py-2 text-center text-lg tracking-widest"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-6 rounded-full shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center font-medium text-lg h-auto"
                      loading={verifyOtpMutation.isPending}
                      icon={<SafetyOutlined />}
                    >
                      {verifyOtpMutation.isPending
                        ? "Verifying..."
                        : "Verify OTP"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-6">
            <Text className="text-gray-500">
              © {new Date().getFullYear()} • All Rights Reserved
            </Text>
          </div>
        </div>
      </div>
    );
  }

  // Trang đăng ký
  return (
    <div className="mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200"></div>
        <Image
          src="/images/world-map.svg"
          alt="World Map"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl w-full mx-auto z-10">
        <Row gutter={48} className="items-center">
          {/* Left side - Travel Inspiration */}
          <Col xs={0} sm={0} md={12} className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-xl h-72 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1746555702228-5c4f5436d4b7?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Travel Experience"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end p-6">
                  <div>
                    <Text className="text-gray-200">
                      Create unforgettable memories
                    </Text>
                  </div>
                </div>
              </div>

              {/* Smaller images */}
              {destinations.map((dest, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden shadow-lg h-36"
                >
                  <Image
                    src={dest.image}
                    alt={`Travel Destination ${dest.name}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-all duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                    <Badge className="bg-white/80 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                      {dest.name}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Right side - Register Form */}
          <Col xs={24} sm={24} md={12}>
            <div className="text-center mb-6">
              <Title level={2} className="mb-2 text-indigo-800 font-bold">
                <GlobalOutlined className="mr-2 text-purple-600" />{" "}
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  TripTales
                </span>
              </Title>
              <Text className="text-gray-600 text-lg">
                Create an account to start exploring our content
              </Text>
            </div>

            <Card className="shadow-lg rounded-xl overflow-hidden border-none hover:shadow-xl transition-all duration-300 mb-6">
              <Steps current={currentStep} className="px-4 py-6">
                <Step title="Register" icon={<UserOutlined />} />
                <Step title="Verify" icon={<SafetyOutlined />} />
                <Step title="Complete" icon={<CheckCircleOutlined />} />
              </Steps>
            </Card>

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
                  <TeamOutlined className="mr-2 text-indigo-600" />
                  Create Account
                </Title>
              </div>

              <Form
                form={form}
                name="register"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Please enter a username!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-indigo-500" />}
                    placeholder="Username"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter an email!" },
                    {
                      type: "email",
                      message: "Please enter a valid email address!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-indigo-500" />}
                    placeholder="Email"
                    className="rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please enter a password!" },
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
                    loading={registerMutation.isPending}
                    icon={<TeamOutlined />}
                  >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                  </Button>
                </Form.Item>

                {/* Travel Inspiration Icons */}
                <div className="grid grid-cols-3 gap-2 my-6">
                  {travelIcons.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="text-2xl text-indigo-600 mb-1">
                        {item.icon}
                      </div>
                      <Text className="text-gray-700 text-xs">{item.text}</Text>
                    </div>
                  ))}
                </div>

                <Divider className="my-6">
                  <Badge color="#4F46E5" />
                  <Badge color="#9333EA" className="mx-2" />
                  <Badge color="#4F46E5" />
                </Divider>

                <div className="text-center">
                  <Space>
                    <Text className="text-gray-600">
                      Already have an account?
                    </Text>
                    <Link
                      href="/login"
                      className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
                    >
                      Sign In
                    </Link>
                  </Space>
                </div>
              </Form>
            </Card>

            <div className="text-center mt-6">
              <Text className="text-gray-500">
                © {new Date().getFullYear()} • All Rights Reserved
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;

// CSS Animation để thêm vào tailwind.config.js hoặc global.css
/*
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
*/
