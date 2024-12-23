import { configureStore } from "@reduxjs/toolkit";
import registerApi from '../services/registerServices';
import userListApi from '../services/userListServices';
import userReducer from '../slices/userSlice';

export const store = configureStore({
    reducer: {
        [registerApi.reducerPath]: registerApi.reducer,
        [userListApi.reducerPath]: userListApi.reducer,
        userReducer: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(registerApi.middleware, userListApi.middleware,userListApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;