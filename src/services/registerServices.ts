import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}

interface RegisterResponse {
    id: string;
    username: string;
    email: string;
}

export const registerApi = createApi({
    reducerPath: 'registerApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004/' }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (body) => ({
                url: 'users',
                method: 'POST',
                body,
            }),
        }
    )
    }),
});

export const { useRegisterUserMutation } = registerApi;
export default registerApi;