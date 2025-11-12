import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "@shared/services/baseQueryWithErrorHandler";

interface LoginRequest {
    account: string;
    password: string;
}

interface LoginResponse {
    user_id: string;
    token: string;
}

export const loginApi = createApi({
    reducerPath: 'loginApi',
    // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004' }),
    baseQuery: baseQueryWithErrorHandler,
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }
    )
    }),
});

export const { useLoginUserMutation } = loginApi;
export default loginApi;