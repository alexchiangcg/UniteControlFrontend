import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../services/registerServices";
import { validationRules } from "../../../utils/validationRules";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onFinish = async (values: {
    account: string;
    password: string;
    confirmPassword: string;
    email: string;
  }) => {
    console.log("onFinish values = ", values);

    if (values.password !== values.confirmPassword) {
      message.error("密碼與確認密碼不相符！");
      return;
    }
    try {
      // Send a POST request to the server /auth/register payload 如下
      const data = {
        account: values.account,
        password: values.password,
        email: values.email,
        group: "user",
      };

      const response = await registerUser(data).unwrap();
      message.success(`註冊成功！歡迎，${response.account}`);
      navigate("/login");
      form.resetFields();
    } catch (error: any) {
      console.error("註冊失敗:", error);

      // 根據 error_code 顯示不同的錯誤訊息
      // 確保 error 符合 FetchBaseQueryError
      if (error?.data?.error_code) {
        switch (error.data.error_code) {
          case "SYS0001":
            message.error("此帳號已被註冊，請更換帳號！");
            break;
          case "SYS0002":
            message.error("電子郵件格式錯誤，請重新輸入！");
            break;
          default:
            message.error("註冊失敗：" + (error.data.message || "未知錯誤"));
        }
      } else {
        message.error("發生未知錯誤，請稍後再試！");
      }
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-center text-2xl font-semibold mb-4">註冊</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            account: "",
            password: "",
            confirmPassword: "",
            email: "",
          }}
        >
          <Form.Item
            label="帳號"
            name="account"
            rules={[
              { required: true, message: "請輸入帳號！" },
              validationRules.account,
            ]}
          >
            <Input placeholder="請輸入帳號" className="rounded-md" />
          </Form.Item>

          <Form.Item
            label="密碼"
            name="password"
            rules={[
              { required: true, message: "請輸入密碼！" },
              validationRules.password,
            ]}
          >
            <Input.Password placeholder="請輸入密碼" className="rounded-md" />
          </Form.Item>

          <Form.Item
            label="確認密碼"
            name="confirmPassword"
            rules={[{ required: true, message: "請再次輸入密碼！" }]}
          >
            <Input.Password
              placeholder="請再次輸入密碼"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item label="email" name="email" rules={[validationRules.email]}>
            <Input placeholder="請輸入 email" className="rounded-md" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              註冊
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;
