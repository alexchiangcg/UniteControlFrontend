import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { username, password } = values;

      // 假設進行 API 請求驗證
      if (username === "alex" && password === "alex1234") {
        localStorage.setItem("authToken", "your_token");
        message.success("登入成功！");
        navigate("/dashboard"); // 跳轉到受保護頁面
      } else {
        message.error("帳號或密碼錯誤！");
      }
    } catch (error) {
      message.error("發生錯誤，請稍後再試！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-10 mx-auto text-center">
  <h1 className="text-[40px] font-bold">登入頁面</h1>
      <Form
        className="w-[400px] mx-auto mt-[15%]"

        name="login"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="帳號"
          name="username"
          rules={[{ required: true, message: "請輸入帳號！" }]}
        >
          <Input placeholder="帳號" />
        </Form.Item>

        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: "請輸入密碼！" }]}
        >
          <Input.Password placeholder="密碼" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登入
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
