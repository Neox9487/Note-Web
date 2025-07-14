import axios from "axios";

type Result = {
  success: boolean;
  message: string;
  id: number;
};

export default async function addNote(
  title: string,
  content: string,
  date: string,
  tags: string[] 
): Promise<Result> {
  const accessToken = localStorage.getItem("access_token");
  try {

    if (!accessToken) {
      return { success: false, message: "未登入", id: -1};
    }
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/note/add`,
      { title, content, date, tags },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return { success: true, message: "成功", id: result.data.id};
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return { success: false, message: "請求資料錯誤", id: -1};
      return { success: false, message: "無法連接伺服器，請稍後再試", id: -1 };
    }

    return { success: false, message: "伺服器錯誤，請稍後再試", id: -1 };
  }
}