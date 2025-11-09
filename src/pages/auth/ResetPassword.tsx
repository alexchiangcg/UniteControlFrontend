// src/pages/auth/ResetPassword.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, message } from "antd";
import AuthLayout from "../../components/AuthLayout";

const { Title, Text } = Typography;

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: ResetPasswordFormValues) => {
    try {
      const { password, confirmPassword } = values;

      if (password !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      // TODO: 實作重設密碼 API 呼叫
      console.log("Reset password values:", { password });

      message.success("Password has been reset successfully");
      navigate("/login");
    } catch (e) {
      message.error("Something went wrong. Please try again.");
    }
  };

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Please enter your password");
    }
    if (value.length < 12 || value.length > 64) {
      return Promise.reject("Password must be 12 to 64 characters long");
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return Promise.reject("Password must contain only letters and numbers");
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject("Please confirm your password");
    }
    const password = form.getFieldValue("password");
    if (value !== password) {
      return Promise.reject("Passwords must match");
    }
    return Promise.resolve();
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
            Reset Password
          </Title>
        </div>

        {/* 重設密碼表單 */}
        <Form<ResetPasswordFormValues>
          form={form}
          layout="vertical"
          name="reset-password"
          onFinish={onFinish}
          requiredMark={(label, { required }) => (
            <>
              {required && <span className="text-[#e85d75] mr-1">*</span>}
              {label}
            </>
          )}
        >
          <Form.Item
            label={<span className="text-base text-[#2e2e2e]">Password</span>}
            name="password"
            rules={[{ validator: validatePassword }]}
            className="mb-2"
            help={
              <span className="text-sm text-[#6b7280]">
                Password must be 12 to 64 characters long and contain only
                letters and numbers.
              </span>
            }
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              autoComplete="new-password"
              className="text-base py-4 px-3 border-[#ced4da] rounded"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-base text-[#2e2e2e]">Confirm Password</span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[{ validator: validateConfirmPassword }]}
            className="mb-6"
            help={
              <span className="text-sm text-[#6b7280]">
                Passwords must match.
              </span>
            }
          >
            <Input.Password
              size="large"
              placeholder="••••••••"
              autoComplete="new-password"
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
              Reset Password
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

export default ResetPasswordPage;
