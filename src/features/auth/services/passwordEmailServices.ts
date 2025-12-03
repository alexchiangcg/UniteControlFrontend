import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

interface SendPasswordEmailRequest {
  account: string;
  email: string;
}

type SendPasswordEmailResponse = Record<string, never>;

export const passwordEmailApi = createApi({
  reducerPath: "passwordEmailApi",
  baseQuery: baseQueryWithErrorHandler,
  endpoints: (builder) => ({
    sendPasswordEmail: builder.mutation<
      SendPasswordEmailResponse,
      SendPasswordEmailRequest
    >({
      query: (body) => ({
        url: "/auth/password-email",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendPasswordEmailMutation } = passwordEmailApi;
export default passwordEmailApi;
