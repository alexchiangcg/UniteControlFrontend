// src/components/AuthLayout.tsx
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f5f7f9] w-full font-['Inter',sans-serif]">
      {/* 左側滿版圖片與說明框 */}
      <div className="hidden md:flex md:w-1/2 h-screen relative flex-col justify-center items-center">
        <img
          src="/src/assets/images/background/login-side.png"
          alt="auth visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* 說明框 */}
        <div className="relative z-10 w-full max-w-[504px] mx-auto bg-[#2e2e2e] rounded opacity-90 p-4">
          <div className="flex gap-4 text-white text-xs mb-4">
            <span>txt</span>
            <span className="ml-auto mr-4">copy</span>
            <span>edit</span>
          </div>
          <div className="text-white text-base leading-relaxed">
            <p className="mb-0">UniteSlave () =&gt; compute.organized();</p>
            <p className="mb-0">&nbsp;</p>
            <p className="mb-0">Orchestrate your power units with precision.</p>
            <p className="mb-0">From scattered cores to streamlined control.</p>
          </div>
        </div>
      </div>

      {/* 右側內容區域 */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
