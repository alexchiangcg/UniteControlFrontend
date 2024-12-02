import { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    // 檢查 token 是否存在，若無則跳轉到 login
    if (!localStorage.getItem("authToken")) {
      navigate("/login");  // 如果未登入則重定向到 login
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="my-10 mx-auto text-center">
      <h1 className="text-[40px] font-bold">Welcome to Dashboard</h1>
      <Button color="danger" variant="filled" onClick={handleLogout}>
        登出
      </Button>
    </div>
  );
};

export default Dashboard;
