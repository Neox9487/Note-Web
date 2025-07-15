import axios from "axios";

export type LogoutResult = {
  success: boolean;
  message: string;
};

export default async function logout(): Promise<LogoutResult> {
  const access_token = localStorage.getItem("access_token");
  if (!access_token)  {
    localStorage.removeItem("access_token");
    return {
      success: true,
      message: "成功登出"
    };
  }
    
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/logout`,
      { access_token },
      { withCredentials: true }
    );

    localStorage.removeItem("access_token");

    return { success: true, message: res.data.message };
  }
  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const message = err.response.data?.message || "發生錯誤";
        return { success: false, message };
      } 
      else 
        return { success: false, message: "無法連線伺服器，請檢查網路或稍後再試" };
    } 
    else 
      return { success: false, message: "發生未知錯誤，請稍後再試" };
  }
}