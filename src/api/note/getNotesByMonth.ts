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
}

export default async function getNotesByMonth(year: number, month: number): Promise<Result> {
  const accessToken = localStorage.getItem("access_token");
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/note/getByMonth`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { year, month },
      withCredentials: true,
    });
    return {success: true, message: "成功", notes: res.data as NoteProps[]};
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status;
      if (status === 400) return { success: false, message: "Bad request", notes: []};
      else return { success: false, message: "無法連接伺服器，請稍後再試", notes: []};
    }
    return { success: false, message: "伺服器錯誤，請稍後再試", notes: []};
  }
}