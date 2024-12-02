import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Button,
  Space,
  DatePicker,
  version,
  ConfigProvider,
  message,
} from "antd";
import zhTW from "antd/locale/zh_TW";
import 'dayjs/locale/zh-tw';
import dayjs from 'dayjs';
dayjs.locale('zh-tw');

const TestAntd = () => {
  const [date, setDate] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const handleChange = (value) => {
    console.log('handleChange.value:', value);
    
    messageApi.info(
      `選擇的日期是: ${value ? value.format("YYYY年MM月DD日") : "未選擇"}`
    );
    setDate(value);
  };
  return (
    <ConfigProvider locale={zhTW}>
      <div style={{ width: 400, margin: "100px auto" }}>
        <DatePicker onChange={handleChange} />
        <div style={{ marginTop: 16 }}>當前日期：{date ? date.format('YYYY年MM月DD日'): "未選擇"}</div>
      </div>
      {contextHolder}
    </ConfigProvider>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="text-9xl text-red-700 font-black">test tailwind</p>

      <hr />
      <h1>antd version: {version}</h1>
      <Space>
        <DatePicker />
        <Button type="primary" onClick={()=>{
            message.info("click primary Button with message");
        }}>Primary Button</Button>
      </Space>
      <TestAntd></TestAntd>
    </>
  );
}

export default App;
