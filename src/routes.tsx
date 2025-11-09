import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 引入頁面組件
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserList from "./pages/UserList";
import CalendarApp from "./pages/Calendar";

// 定義路由配置
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" />, // 默認重定向到登入頁
    children: [],
  },
  {
    path: "/home",
    element: <Home />,
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
    path: "/dashboard",
    element: <Dashboard />,
    children: [],
    //authRequired: true, // 自定義屬性，用於權限控制
  },
  {
    path: "/user-list",
    element: <UserList />,
    children: [],
  },
  {
    path: "/demo-calendar",
    element: <CalendarApp />,
  },
  {
    path: "*",
    element: <NotFound />, // 404 頁面
    children: [],
  },
];

export default routes;
