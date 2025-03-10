import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { message } from "antd";


interface ApiResponse<T = any> {
    error_code?: string;
    error_message?: string;
    data?: T;
  }
  

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandler: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error("API Error:", result.error);

    // 顯示 API 請求錯誤（例如網路錯誤、500 錯誤）
    message.error("發生錯誤，請稍後再試！");
    return result; // 讓 caller 可以捕捉錯誤
  }

  const res = result.data as ApiResponse;

  if (res.error_code && res.error_code !== "00000") {
    const errorMessage = res.error_message || "";

    // 顯示 API 回傳的錯誤訊息
    message.error(`錯誤碼 ${res.error_code}：請求失敗`);
    message.error(errorMessage);

    // 回傳錯誤，讓 caller (`Register.tsx`) 可以根據錯誤做額外處理
    return {
      error: {
        status: "CUSTOM_ERROR",
        error_code: res.error_code,
        message: errorMessage,
      },
    };
  }

  return { data: res.data };
};

export default baseQueryWithErrorHandler;
