import axios from "axios";

export type RegisterResult = {
  success: boolean;
  message: string;
};

export default async function register(username: string, password: string): Promise<RegisterResult> {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/register`,
      { username, password },
      { withCredentials: true }
    );

    const { accessToken, message } = res.data;
    localStorage.setItem("access_token", accessToken);

    return { success: true, message: message || "註冊成功" };

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) 
        return { success: false, message: err.response.data?.message || "註冊失敗"};
      else 
        return { success: false, message: "無法連線伺服器，請檢查網路或稍後再試" };
    } 
    else 
      return { success: false, message: "發生未知錯誤，請稍後再試" };
  }
}
