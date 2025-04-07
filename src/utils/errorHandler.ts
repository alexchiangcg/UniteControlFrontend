export interface AppError {
    code: string;
    message: string;
    status?: number;
  }
  
  export const ErrorCodes = {
    SYS0001: { code: "SYS0001", message: "系統內部錯誤" },
    API0001: { code: "API0001", message: "參數不正確" },
    AUTH0001: { code: "AUTH0001", message: "登入已過期，請重新登入" },
    AUTH0002: { code: "AUTH0002", message: "權限不足" },
    AUTH0003: { code: "AUTH0003", message: "帳號或密碼錯誤" },
    AUTH0004: { code: "AUTH0004", message: "產生 Token 失敗" },
    USR0001: { code: "USR0001", message: "使用者已存在" },
    USR0002: { code: "USR0002", message: "使用者不存在" },
    GRP0001: { code: "GRP0001", message: "群組已存在" },
    GRP0002: { code: "GRP0002", message: "群組不存在" },
  } as const;
  
  export const getErrorMessage = (errorCode: string, defaultMessage?: string): string => {
    const error = Object.values(ErrorCodes).find(err => err.code === errorCode);
    return error?.message || defaultMessage || "未知錯誤";
  };