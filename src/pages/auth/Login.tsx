// src/pages/auth/Login.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useLoginUserMutation } from "../../services/loginServices";

const { Title, Text } = Typography;

interface LoginFormValues {
  account: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const { account, password } = values;
      const response = await loginUser({ account, password }).unwrap();

      if (response?.token) {
        localStorage.setItem("authToken", response.token);
        message.success("Login successful");
        navigate("/dashboard");
      } else {
        message.error("Invalid account or password");
      }
    } catch (e) {
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] w-full">
      {/* 左側滿版圖片 (md 以上顯示) */}
      <div className="hidden md:block md:w-1/2 h-full">
        <img
          src="/src/assets/images/background/login-side.png"
          alt="login visual"
          className="w-full h-full object-cover"
        />
      </div>
      {/* 右側登入卡片置中 */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md shadow-lg p-8" bordered>
          <div className="mb-6 text-center">
            <Title level={2} style={{ margin: 0 }}>
              Unite Slave
            </Title>
          </div>
          <Form<LoginFormValues>
            layout="vertical"
            name="login"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Account"
              name="account"
              rules={[{ required: true, message: "Please enter your account" }]}
            >
              <Input
                size="large"
                placeholder="Enter your account"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>
            <div className="mb-4 -mt-2">
              <Link to="/forgot-password">
                <Text type="secondary">Forget your password?</Text>
              </Link>
            </div>
            <Form.Item style={{ marginBottom: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
        {/* 卡片下方 */}
        <div className="text-center mt-4">
          <Text type="secondary">copyright © uniteslave</Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
