// src/features/auth/components/ForgotPassword.tsx
import React from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useSendPasswordEmailMutation } from "../services/passwordEmailServices";
import AuthLayout from "../layouts/AuthLayout";

const { Title, Text } = Typography;

interface ForgotPasswordFormValues {
  account: string;
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [sendPasswordEmail, { isLoading }] = useSendPasswordEmailMutation();

  const onFinish = async (values: ForgotPasswordFormValues) => {
    try {
      await sendPasswordEmail(values).unwrap();
      message.success("驗證碼已寄送至您的電子郵件");

      // 可以導向到驗證碼輸入頁面
      // navigate("/verify-code");
    } catch (e) {
      console.error("忘記密碼寄信失敗:", e);
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
            className="!m-0 !text-[38px] !font-bold !leading-[38px] !text-gray-500"
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
              {required && <span className="text-error mr-1">*</span>}
              {label}
            </>
          )}
        >
          <Form.Item
            label={<span className="text-base text-gray-500">Account</span>}
            name="account"
            rules={[{ required: true, message: "請輸入帳號" }]}
            className="mb-6"
          >
            <Input
              size="large"
              placeholder="Enter your account"
              autoComplete="username"
              className="text-base py-4 px-3 border-gray-200 rounded"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-base text-gray-500">Email</span>}
            name="email"
            rules={[
              { required: true, message: "請輸入電子郵件" },
              { type: "email", message: "請輸入有效的電子郵件" },
            ]}
            className="mb-6"
          >
            <Input
              size="large"
              placeholder="Enter your Email Address"
              autoComplete="email"
              className="text-base py-4 px-3 border-gray-200 rounded"
            />
          </Form.Item>

          {/* 送出按鈕 */}
          <Form.Item className="mb-0">
            <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            className="bg-blue-400 border-blue-400 hover:bg-blue-500 hover:border-blue-500 text-base font-medium h-[50px] rounded"
          >
              Get Verification Code
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 版權資訊 */}
      <div className="text-center mt-6">
        <Text className="text-xs text-second-blue-400">
          copyright © uniteslave
        </Text>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
