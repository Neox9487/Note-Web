import axios from "axios";

export type LoginResult = {
  success: boolean;
  message: string;
};

export default async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`,
      { username, password },
      { withCredentials: true }
    );

    const { accessToken } = res.data;
    localStorage.setItem("access_token", accessToken);

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