import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.css"; // CSS 變數定義
import "./index.css";
import "./styles/antd-overrides.css"; // 直接引入 Ant Design 覆寫樣式
import App from "./App.tsx";
import "./i18n"; // 要先引入

import { Provider } from "react-redux";
import { store } from "./store/store";

// 在開發環境啟用 MSW
async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
});
