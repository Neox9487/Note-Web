import axios from "axios";

type Result = {
  success: boolean;
  message: string;
}

export default async function deleteNote(id: number): Promise<Result> {
  const accessToken = localStorage.getItem("access_token");
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/note/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    return {success: true, message: "成功"};
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return { success: false, message: "Bad request"};
      else if (status === 404) return { success: false, message: "找不到筆記 id="+id};
      else return { success: false, message: "無法連接伺服器，請稍後再試"};
    }
    return { success: false, message: "伺服器錯誤，請稍後再試"};
  }
}