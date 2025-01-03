import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../../services/registerServices";
import Header from "../../components/Header";
import { validationRules } from "../../utils/validationRules";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onFinish = async (values: {
    username: string;
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
      const data = {
        username: values.username,
        password: values.password,
        email: values.email,
        group: "user",
      };

      const response = await registerUser(data).unwrap();
      message.success(`註冊成功！歡迎，${response.username}`);
      navigate("/login");
      form.resetFields();
    } catch (error) {
      message.error("註冊失敗，請再試一次。" + error);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="max-w-md mx-auto mt-12 p-6 border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-center text-2xl font-semibold mb-4">註冊</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
          }}
        >
          <Form.Item
            label="帳號"
            name="username"
            rules={[
              { required: true, message: "請輸入帳號！" },
              validationRules.username,
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
