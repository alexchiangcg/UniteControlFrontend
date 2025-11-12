import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LogoutRequest {
    user_id: string;
}

interface LogoutResponse {
 
}

export const logoutApi = createApi({
    reducerPath: 'logoutApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004' }),
    endpoints: (builder) => ({
        logoutUser: builder.mutation<LogoutResponse, LogoutRequest>({
            query: (body) => ({
                url: `/users/${body.user_id}/logout`,
                method: 'POST'
            }),
        }
    )
    }),
});

export const { useLogoutUserMutation } = logoutApi;
export default logoutApi;