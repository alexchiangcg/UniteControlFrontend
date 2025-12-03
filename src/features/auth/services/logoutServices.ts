import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

type LogoutResponse = Record<string, never>;

export const logoutApi = createApi({
  reducerPath: "logoutApi",
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    logoutUser: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLogoutUserMutation } = logoutApi;
export default logoutApi;
