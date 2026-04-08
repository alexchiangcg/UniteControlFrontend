import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import { getErrorMessage } from '../utils/errorHandler';



interface ApiResponse<T = any> {
  error_code?: string;
  error_message?: string;
  data?: T;
}


const baseQuery = fetchBaseQuery({
  // Docker 執行時期環境變數注入：
  // 佔位符未被替換（本地開發）→ 使用 .env 的值
  // 佔位符已被 entrypoint.sh 替換（Docker 部署）→ 使用替換後的真實值
  baseUrl: "__VITE_API_URL_PLACEHOLDER__".startsWith("__")
    ? import.meta.env.VITE_API_URL
    : "__VITE_API_URL_PLACEHOLDER__",
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

    // 檢查錯誤回應中是否包含 error_code 和 error_message
    const errorData = result.error.data as ApiResponse;
    if (errorData?.error_code) {
      const errorMessage = getErrorMessage(errorData.error_code, errorData.error_message);
      message.error(`錯誤碼 ${errorData.error_code}：${errorMessage}`);
    } else {
      message.error("發生錯誤，請稍後再試！");
    }

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
