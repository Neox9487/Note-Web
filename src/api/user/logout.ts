import axios from "axios";

export type LogoutResult = {
  success: boolean;
  message: string;
};

export default async function logout(): Promise<LogoutResult> {
  try {
    await axios.post(
      import.meta.env.VITE_API_URL + "/logout",
      {},
      { withCredentials: true }
    );

    try {
      localStorage.removeItem("access_token");
    } catch (_) {}

    return { success: true, message: "" };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      const serverMessage = err.response.data?.message || "";

      switch (status) {
        case 400:
          return { success: false, message: "錯誤的請求。" };
        case 401:
          return { success: false, message: "尚未登入或登入已過期。" };
        case 500:
          return { success: false, message: "伺服器錯誤，請稍後再試。" };
        default:
          return {
            success: false,
            message: serverMessage || "登出失敗，請稍後再試。"
          };
      }
    } else {
      return { success: false, message: "無法連接伺服器，請稍後再試。" };
    }
  }
}