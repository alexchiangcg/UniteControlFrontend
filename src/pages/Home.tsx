// src/pages/Home.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Space,
  DatePicker,
  version,
  ConfigProvider,
  message,
} from "antd";
import zhTW from "antd/locale/zh_TW";
import "dayjs/locale/zh-tw";
import dayjs from "dayjs";
import Header from "../components/Header";

dayjs.locale("zh-tw");

const TestAntd = () => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  interface HandleChangeParams {
    value: dayjs.Dayjs | null;
  }

  const handleChange = (value: HandleChangeParams['value']) => {
    messageApi.info(
      `選擇的日期是: ${value ? value.format("YYYY年MM月DD日") : "未選擇"}`
    );
    setDate(value);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
      locale={zhTW}
    >
      <div className="my-5">
        <DatePicker onChange={handleChange} />
        <div style={{ marginTop: 16 }}>
          當前日期：{date ? date.format("YYYY年MM月DD日") : "未選擇"}
        </div>
      </div>
      {contextHolder}
    </ConfigProvider>
  );
};

const Home = () => {
  // const [count, setCount] = useState(0);

  if (import.meta.env.MODE === 'development') {
    console.log('目前是開發環境');
  }
  



  return (
    <>
    <Header></Header>
      <div className="mx-auto w-screen flex flex-col justify-center items-center">
        <h1 className="text-9xl text-red-700 font-black">Home tailwind</h1>

        <hr />
        <h1>antd version: {version}</h1>
        <Space>
          <DatePicker />
          <Link to="/login">
            <Button
              type="primary"
              onClick={() => {
                message.info("click 登入頁面 with message.info");
              }}
            >
              登入頁面
            </Button>
          </Link>
        </Space>
        <TestAntd />
      </div>
    </>
  );
};

export default Home;
