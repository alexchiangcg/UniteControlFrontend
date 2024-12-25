// validationRules.ts
export const validationRules = {
    username: {
      pattern: /^[a-zA-Z0-9_]{6,32}$/,
      message: "帳號必須是 6-32 個字元，且只能包含英文、數字和下劃線！",
    },
    password: {
      pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      message: "密碼至少 8 個字元，包含至少 1 個大寫字母和 1 個數字！",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "請輸入有效的電子郵件地址！",
    },
  };
  