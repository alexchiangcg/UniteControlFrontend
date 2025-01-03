import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    user_id: string;
    token: string;
}

export const loginApi = createApi({
    reducerPath: 'loginApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004' }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: '/users/login',
                method: 'POST',
                body,
            }),
        }
    )
    }),
});

export const { useLoginUserMutation } = loginApi;
export default loginApi;