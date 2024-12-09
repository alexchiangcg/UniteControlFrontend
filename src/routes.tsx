import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 引入頁面組件
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

// 定義路由配置
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" />, // 默認重定向
    children: []
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
    path: "/dashboard",
    element: <Dashboard />,
    children: [],
    //authRequired: true, // 自定義屬性，用於權限控制
  },
  {
    path: "*",
    element: <NotFound />, // 404 頁面
    children: []
  },
];

export default routes;
