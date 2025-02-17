import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
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