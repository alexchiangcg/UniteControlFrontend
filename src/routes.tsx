import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 引入頁面組件
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import BookingCreate from "./pages/booking/BookingCreate";

// 定義路由配置
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" />, // 默認重定向到登入頁
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
  },
  {
    path: "/register",
    element: <Register />,
    children: [],
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    children: [],
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    children: [],
  },
  {
    path: "/booking/create",
    element: <BookingCreate />,
    children: [],
  },
  {
    path: "*",
    element: <NotFound />, // 404 頁面
    children: [],
  },
];

export default routes;
