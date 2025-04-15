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
import { toast } from "react-hot-toast";
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
      toast.error(validationError);
      return;
    }

    try {
      await registerMutation.mutateAsync(values);
      setRegisteredEmail(values.email);
      setShowOtpForm(true);
      toast.success("Please check your email for OTP verification code");
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
      toast.success("Account verified successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
    }
  };

  if (showOtpForm) {
    return (
      <div className="x-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Card
          title={<h2 className="text-center text-2xl font-bold">Xác thực OTP</h2>}
          className="max-w-md mx-auto"
        >
          <p className="text-center mb-4">
            Mã OTP đã được gửi đến {registeredEmail}
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
                { required: true, message: "Hãy nhập mã OTP!" },
                { len: 6, message: "Mã OTP phải có chính xác 6 ký tự!" },
              ]}
            >
              <Input
                prefix={<NumberOutlined />}
                placeholder="Nhập mã OTP gồm 6 chữ số"
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
                {verifyOtpMutation.isPending ? "Đang xác thực ..." : "Xác thực mã OTP"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }

  return (
    <div className="x-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card
        title={<h2 className="text-center text-2xl font-bold">Đăng Ký</h2>}
        className="w-full sm:max-w-md mx-auto"
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
            rules={[{ required: true, message: "Hãy nhập tên đăng nhập!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Hãy nhập email!" },
              { type: "email", message: "Hãy nhập đúng định dạng email!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Hãy nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300"
              loading={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Đang đăng ký" : "Đăng ký"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Space>
              <span>Đã có tài khoản?</span>
              <Link href="/login" className="text-blue-500 hover:text-blue-700">
                Đăng nhập
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
