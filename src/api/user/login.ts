import axios from "axios";

export type LoginResult = {
  success: boolean;
  message: string;
};

export default async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await axios.post(
      import.meta.env.VITE_API_URL+"/login",
      {username, password},
      {withCredentials: true}
    )
    const { accessToken } = res.data;
    localStorage.setItem("access_token", accessToken);
    return {success: true, message: ""};
  }
  catch (err: unknown) {
    if(axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return {success: false, message: "Bad request"}
      else if(status === 401) return {success: false, message: "帳號或密碼錯誤"}
      else return {success: false, message: "無法連接伺服器，請稍後再試"}
    }
    else {
      return {success: false, message: "伺服器錯誤，請稍後再試"}
    }
  }
}