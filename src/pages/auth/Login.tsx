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
    <div className="flex min-h-screen bg-[#f5f7f9] w-full font-['Inter',sans-serif]">
      {/* 左側滿版圖片與說明框 */}
      <div className="hidden md:flex md:w-1/2 h-screen relative flex-col justify-center items-center">
        <img
          src="/src/assets/images/background/login-side.png"
          alt="login visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 說明框 */}
        <div className="relative z-10 w-full max-w-[504px] mx-auto bg-[#2e2e2e] rounded opacity-90 p-4">
          <div className="flex gap-4 text-white text-xs mb-4">
            <span>txt</span>
            <span className="ml-auto mr-4">copy</span>
            <span>edit</span>
          </div>
          <div className="text-white text-base leading-relaxed">
            <p className="mb-0">UniteSlave () =&gt; compute.organized();</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">Orchestrate your power units with precision.</p>
            <p className="mb-0">From scattered cores to streamlined control.</p>
          </div>
        </div>
      </div>

      {/* 右側登入卡片 */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        <Card
          className="w-full max-w-md shadow-lg py-10 px-6 rounded-lg"
          bordered={false}
        >
          {/* 標題 */}
          <div className="mb-12 text-center">
            <Title
              level={2}
              className="!m-0 !text-[38px] !font-bold !leading-[38px] !text-[#2e2e2e]"
            >
              Unite Slave
            </Title>
          </div>

          {/* 登入表單 */}
          <Form<LoginFormValues>
            layout="vertical"
            name="login"
            onFinish={onFinish}
            requiredMark={(label, { required }) => (
              <>
                {required && <span className="text-[#e85d75] mr-1">*</span>}
                {label}
              </>
            )}
          >
            <Form.Item
              label={<span className="text-base text-[#2e2e2e]">Account</span>}
              name="account"
              rules={[{ required: true, message: "Please enter your account" }]}
              className="mb-6"
            >
              <Input
                size="large"
                placeholder="Enter your account"
                autoComplete="username"
                className="text-base py-4 px-3 border-[#ced4da] rounded"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-base text-[#2e2e2e]">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
              className="mb-6"
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="text-base py-4 px-3 border-[#ced4da] rounded"
              />
            </Form.Item>

            {/* 忘記密碼連結 */}
            <div className="mb-6">
              <Link
                to="/forgot-password"
                className="text-base font-medium text-[#2f6f9f] no-underline hover:text-[#2f6f9f]"
              >
                Forget your password?
              </Link>
            </div>

            {/* 登入按鈕 */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                className="bg-[#2f6f9f] border-[#2f6f9f] hover:bg-[#2f6f9f] hover:border-[#2f6f9f] text-base font-medium h-[50px] rounded"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 版權資訊 */}
        <div className="text-center mt-6">
          <Text className="text-xs text-[#5a7684]">
            copyright © uniteslave
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
