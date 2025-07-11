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
    const { accessToken, username } = res.data; 
    localStorage.setItem("access_token", accessToken);
    return { success: true, message: "", username: username};
  } catch (err: unknown) {
    localStorage.removeItem("access_token");
    return { success: false, message: "無法重新驗證身分，請重新登入", username: null};
  }
}