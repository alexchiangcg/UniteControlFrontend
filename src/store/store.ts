import { configureStore } from "@reduxjs/toolkit";
import { registerApi, loginApi, logoutApi } from '@features/auth';
import userListApi from '../services/userListServices';
import userReducer from '../slices/userSlice';

export const store = configureStore({
    reducer: {
        [registerApi.reducerPath]: registerApi.reducer,
        [userListApi.reducerPath]: userListApi.reducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [logoutApi.reducerPath]: logoutApi.reducer,
        userReducer: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            registerApi.middleware, 
            userListApi.middleware, 
            loginApi.middleware, 
            logoutApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;