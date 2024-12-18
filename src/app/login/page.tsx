"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, Card, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validation";
import { LoginState } from "../types/auth";

const Login: React.FC = () => {
  const router = useRouter();
  const { loginMutation } = useAuth();
  const [form] = Form.useForm();

  React.useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (values: LoginState): Promise<void> => {
    const validationError = validateLogin(values);
    if (validationError) {
      toast.error(validationError, { autoClose: 2000 });
      return;
    }

    loginMutation.mutate(values);
  };

  return (
    <div className="mx-auto px-4 py-8">
      <Card
        title={<h2 className="text-center text-2xl font-bold">Login</h2>}
        className="max-w-md mx-auto"
      >
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
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
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
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Space>
              <span>Need an account?</span>
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-700"
              >
                Register
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
