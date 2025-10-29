// src/pages/auth/ForgotPassword.tsx
import React from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import AuthLayout from "../../components/AuthLayout";

const { Title, Text } = Typography;

interface ForgotPasswordFormValues {
  account: string;
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: ForgotPasswordFormValues) => {
    try {
      const { account, email } = values;

      // TODO: 實作忘記密碼 API 呼叫
      console.log("Forgot password values:", { account, email });

      message.success("Verification code has been sent to your email");

      // 可以導向到驗證碼輸入頁面
      // navigate("/verify-code");
    } catch (e) {
      message.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout>
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
            Forget Password
          </Title>
        </div>

        {/* 忘記密碼表單 */}
        <Form<ForgotPasswordFormValues>
          form={form}
          layout="vertical"
          name="forgot-password"
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
            label={<span className="text-base text-[#2e2e2e]">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            className="mb-6"
          >
            <Input
              size="large"
              placeholder="Enter your Email Address"
              autoComplete="email"
              className="text-base py-4 px-3 border-[#ced4da] rounded"
            />
          </Form.Item>

          {/* 送出按鈕 */}
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="bg-[#2f6f9f] border-[#2f6f9f] hover:bg-[#2f6f9f] hover:border-[#2f6f9f] text-base font-medium h-[50px] rounded"
            >
              Get Verification Code
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 版權資訊 */}
      <div className="text-center mt-6">
        <Text className="text-xs text-[#5a7684]">copyright © uniteslave</Text>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
