import axios from "axios";

export type AuthResult = {
  success: boolean;
  message: string;
  username: string | null;
};

export default async function refresh(): Promise<AuthResult> {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL + "/refresh",
      {},
      {
        withCredentials: true, 
      }
    );
    localStorage.setItem("access_token", res.data.access_token);
    return { success: true, message: res.data.message, username: res.data.username};
    
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const message = err.response.data?.message || "刷新失敗";
        return { success: false, message: message, username: null };
      } 
      else 
        return { success: false, message: "無法連線伺服器，請檢查網路或稍後再試", username: null};
    } 
    else 
      return { success: false, message: "發生未知錯誤，請稍後再試", username: null };
    
  }
}