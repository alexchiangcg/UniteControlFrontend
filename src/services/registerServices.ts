import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithErrorHandler from "./baseQueryWithErrorHandler";

interface RegisterRequest {
    account: string;
    password: string;
    email: string;
    group: string;
}

interface RegisterResponse {
    id: string;
    account: string;
    email: string;
}

export const registerApi = createApi({
    reducerPath: 'registerApi',
    // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
    baseQuery: baseQueryWithErrorHandler,
    endpoints: (builder) => ({
        registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({
                url: '/auth/register',
                method: 'POST',
                body,
            }),
        }
    )
    }),
});

export const { useRegisterUserMutation } = registerApi;
export default registerApi;