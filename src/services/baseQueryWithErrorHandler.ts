import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import { getErrorMessage } from '../utils/errorHandler';



interface ApiResponse<T = any> {
  error_code?: string;
  error_message?: string;
  data?: T;
}


const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithErrorHandler = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.error("API Error:", result.error);
    message.error("發生錯誤，請稍後再試！");
    return result; // 讓 caller 可以捕捉錯誤
  }

  const res = result.data as ApiResponse;

  if (res.error_code && res.error_code !== "00000") {
    const errorMessage = getErrorMessage(res.error_code, res.error_message);
    message.error(`錯誤碼 ${res.error_code}：${errorMessage}`);

    // 回傳錯誤，讓 caller (`Register.tsx`) 可以根據錯誤做額外處理
    const customError: FetchBaseQueryError = {
      status: "CUSTOM_ERROR" as any, // 強制轉型，但仍符合 FetchBaseQueryError 結構
      data: { error_code: res.error_code, message: errorMessage },
    };

    return { error: customError };

    /* return {
      error: {
        status: "CUSTOM_ERROR" as any,
        error_code: res.error_code,
        message: errorMessage,
      },
    }; */
  }

  return { data: res.data };
};

export default baseQueryWithErrorHandler;
