import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig } from "axios";
import refresh from "../api/user/refresh";

export default async function authRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  let accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    throw new Error("未登入");
  }

  try {
    const res = await axios.request<T>({
      ...config,
      headers: {
        ...(config.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as AxiosError;

    if (axiosErr.response?.status === 401) {
      const refreshed = await refresh();
      if (!refreshed.success) {
        throw new Error("登入已過期，請重新登入");
      }

      accessToken = localStorage.getItem("access_token");
      const retryRes = await axios.request<T>({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      return retryRes.data;
    }

    throw err;
  }
}