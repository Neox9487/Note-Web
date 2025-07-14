import axios from "axios";

type NoteProps = {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

type Result = {
  success: boolean;
  message: string;
  notes: NoteProps[];
  pages: number;
}

export default async function getFiltedNotes(page: number, query: string, tags: string[]): Promise<Result> {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    return { success: false, message: "未登入", notes:[], pages:0};
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/note/getAll`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {page, query, tags},
      withCredentials: true,
    });
    return {success: true, message: "成功", notes: res.data.notes as NoteProps[], pages: res.data.pages};
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return { success: false, message: "Bad request", notes: [], pages:0};
      else return { success: false, message: "無法連接伺服器，請稍後再試", notes: [], pages:0};
    }
    return { success: false, message: "伺服器錯誤，請稍後再試", notes: [], pages:0};
  }
}