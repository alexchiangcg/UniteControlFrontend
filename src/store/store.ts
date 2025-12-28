import { configureStore } from "@reduxjs/toolkit";
import { registerApi, loginApi, logoutApi, passwordEmailApi, resetPasswordApi } from '@features/auth';
import userListApi from '@shared/services/userListServices';
import userReducer from '@shared/slices/userSlice';
import { userManagementApi } from '@features/maintainer-manager/services/userManagementServices';
import { bookingCalendarApi } from '@features/booking/services/bookingCalendarServices';
import { bookingHistoryApi } from '@features/booking/api/bookingHistoryApi';
import { resourceLimitApi, userConfigApi } from '@features/users';

export const store = configureStore({
    reducer: {
        [registerApi.reducerPath]: registerApi.reducer,
        [userListApi.reducerPath]: userListApi.reducer,
        [loginApi.reducerPath]: loginApi.reducer,
        [logoutApi.reducerPath]: logoutApi.reducer,
        [passwordEmailApi.reducerPath]: passwordEmailApi.reducer,
        [resetPasswordApi.reducerPath]: resetPasswordApi.reducer,
        [userManagementApi.reducerPath]: userManagementApi.reducer,
        [bookingCalendarApi.reducerPath]: bookingCalendarApi.reducer,
        [bookingHistoryApi.reducerPath]: bookingHistoryApi.reducer,
        [resourceLimitApi.reducerPath]: resourceLimitApi.reducer,
        [userConfigApi.reducerPath]: userConfigApi.reducer,
        userReducer: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            registerApi.middleware,
            userListApi.middleware,
            loginApi.middleware,
            logoutApi.middleware,
            passwordEmailApi.middleware,
            resetPasswordApi.middleware,
            userManagementApi.middleware,
            bookingCalendarApi.middleware,
            bookingHistoryApi.middleware,
            resourceLimitApi.middleware,
            userConfigApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
