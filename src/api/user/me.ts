import axios from "axios";
import refresh from "./refresh";

export type AuthResult = {
  success: boolean;
  message: string;
  username: string | null;
};

export default async function fetchMe(): Promise<AuthResult> {
  let accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, message: "未登入", username: null};
  }

  const handleSuccess = (message: string, username: string): AuthResult => {
    return { success: true, message: message, username: username};
  };

  const callApi = (token: string) => {
    return axios.post(
      import.meta.env.VITE_API_URL + "/me",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
  };

  try {
    const result = await callApi(accessToken);
    return handleSuccess(result.data.message, result.data.username);
  } 
  catch (err: unknown) {
    const refreshResult = await refresh();

    if (!refreshResult.success) {
      return { success: false, message: refreshResult.message, username: null };
    }

    const newToken = localStorage.getItem("access_token");

    if (!newToken) {
      return { success: false, message: "重新登入失敗", username: null };
    }

    try {
      const retryResult = await callApi(newToken);
      return { success: true, message: retryResult.data.message, username: retryResult.data.username };
    } 
    catch {
      return { success: false, message: "重新登入後仍無法驗證身份", username: null };
    }
  }
}