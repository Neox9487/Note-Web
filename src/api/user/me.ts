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

  const handleSuccess = (username: string): AuthResult => {
    return { success: true, message: "", username: username};
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
    return handleSuccess(result.data.username);
  } 
  catch (err: unknown) {
    const refreshed = await refresh();
    if (!refreshed.success) {
      return { success: false, message: "登入逾時，請重新登入", username: null};
    }
    const newAccessToken = localStorage.getItem("access_token");
    if (!newAccessToken) {
      return { success: false, message: "驗證失敗，請重新登入", username: null};
    }

    try {
      const result = await callApi(newAccessToken);
      return handleSuccess(result.data.username);
    } catch {
      return { success: false, message: "驗證失敗，請重新登入", username: null};
    }
  }
}