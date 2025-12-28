import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

/**
 * 重設密碼請求介面
 * 對應 swagger: ResetPasswordRequest
 */
interface ResetPasswordRequest {
  new_password: string;
}

type ResetPasswordResponse = Record<string, never>;

/**
 * Reset Password API
 *
 * POST /auth/reset-password - 重設密碼，驗證使用者並更新密碼
 */
export const resetPasswordApi = createApi({
  reducerPath: "resetPasswordApi",
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useResetPasswordMutation } = resetPasswordApi;
export default resetPasswordApi;
