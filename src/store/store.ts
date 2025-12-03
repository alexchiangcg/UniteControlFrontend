import { configureStore } from "@reduxjs/toolkit";
import { registerApi, loginApi, logoutApi, passwordEmailApi } from '@features/auth';
import userListApi from '@shared/services/userListServices';
import userReducer from '@shared/slices/userSlice';
import { userManagementApi } from '@features/maintainer-manager/services/userManagementServices';

export const store = configureStore({
    reducer: {
        [registerApi.reducerPath]: registerApi.reducer,
        [userListApi.reducerPath]: userListApi.reducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [logoutApi.reducerPath]: logoutApi.reducer,
        [passwordEmailApi.reducerPath]: passwordEmailApi.reducer,
        [userManagementApi.reducerPath]: userManagementApi.reducer,
        userReducer: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            registerApi.middleware,
            userListApi.middleware,
            loginApi.middleware,
            logoutApi.middleware,
            passwordEmailApi.middleware,
            userManagementApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
