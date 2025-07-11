import axios from "axios";

export type RegisterResult = {
  success: boolean;
  message: string;
};

export default async function register(username: string, password: string): Promise<RegisterResult> {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL+"/register",
      {username, password},
      {withCredentials: true}
    )
    const { accessToken } = res.data;
    localStorage.setItem("access_token", accessToken);
    return {success: true, message: ""};
  }
  catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return {success: false, message: "Bad request"}
      else if(status === 409) return {success: false, message: "用戶名已存在"}
      else if(status === 422) return {success: false, message: "密碼不合法"}
      else return {success: false, message: "無法連接伺服器，請稍後再試"}
    }
    else {
      return {success: false, message: "伺服器錯誤，請稍後再試"}
    }
  }
}