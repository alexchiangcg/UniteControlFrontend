import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const go = useNavigate();
  return (
    <header className="sticky top-0 bg-white border-b-[1px] border-gray-300">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">Unite Slave</h1>
        <nav>
          <ul className="flex space-x-4">
            <li className="cursor-pointer" onClick={() => go("/")}>Home</li>
            <li className="cursor-pointer" onClick={() => go("/dashboard")}>Dashboard</li>
            <li className="cursor-pointer" onClick={() => go("/user-list")}>UserList</li>
            <li className="cursor-pointer" onClick={() => go("/login")}>Login</li>
            <li className="cursor-pointer" onClick={() => go("/register")}>register</li>
            <li className="cursor-pointer" onClick={() => go("/demo-calendar")}>calendar</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
