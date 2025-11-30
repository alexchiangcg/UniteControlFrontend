import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 引入頁面組件 - 使用新的 feature-based 結構
import { Login, Register, ForgotPassword, ResetPassword } from "@features/auth";
import { BookingCreate } from "@features/booking";
import { UserManagement, CreateUser } from "@features/maintainer-manager";
import NotFound from "@shared/pages/NotFound";

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
    path: "/maintainer/users",
    element: <UserManagement />,
    children: [],
  },
  {
    path: "/maintainer/users/create",
    element: <CreateUser />,
    children: [],
  },
  {
    path: "*",
    element: <NotFound />, // 404 頁面
    children: [],
  },
];

export default routes;
