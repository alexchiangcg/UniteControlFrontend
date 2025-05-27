import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const go = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 bg-white border-b-[1px] border-gray-300">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">Unite Slave</h1>
        <div className="flex items-center space-x-6">
          <nav>
            <ul className="flex space-x-4">
              <li className="cursor-pointer" onClick={() => go("/")}>
                {t("nav.home")}
              </li>
              <li className="cursor-pointer" onClick={() => go("/dashboard")}>
                {t("nav.dashboard")}
              </li>
              <li className="cursor-pointer" onClick={() => go("/user-list")}>
                {t("nav.userList")}
              </li>
              <li className="cursor-pointer" onClick={() => go("/login")}>
                {t("nav.login")}
              </li>
              <li className="cursor-pointer" onClick={() => go("/register")}>
                {t("nav.register")}
              </li>
              <li className="cursor-pointer" onClick={() => go("/demo-calendar")}>
                {t("nav.calendar")}
              </li>
            </ul>
          </nav>
          <button
            onClick={toggleLanguage}
            className="w-16 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-center"
          >
            {i18n.language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
