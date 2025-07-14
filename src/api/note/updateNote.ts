import axios from "axios";

type Result = {
  success: boolean;
  message: string;
};

export default async function updateNote(
  id: number,
  title: string,
  description: string,
  tags: string[] 
): Promise<Result> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, message: "未登入"};
  }
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/note/update/${id}`,
      { title, description, tags },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return { success: true, message: "成功" };
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return { success: false, message: "上傳錯誤" };
      if (status === 404) return { success: false, message: "找不到筆記 ID="+id.toString() };
      return { success: false, message: "無法連接伺服器，請稍後再試" };
    }

    return { success: false, message: "伺服器錯誤，請稍後再試" };
  }
}