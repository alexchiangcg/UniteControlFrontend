import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const go = useNavigate();
  return (
    <header className="sticky top-0 bg-white border-b-[1px] border-gray-300">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">React Router v6</h1>
        <nav>
          <ul className="flex space-x-4">
            <li onClick={() => go("/")}>Home</li>
            <li onClick={() => go("/dashboard")}>Dashboard</li>
            <li onClick={() => go("/login")}>Login</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
