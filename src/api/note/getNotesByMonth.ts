import authRequest from "../../utils/authRequest";


type NoteProps = {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
};

type Result = {
  success: boolean;
  message: string;
  notes: NoteProps[];
};

export default async function getNotesByMonth(
  year: number,
  month: number
): Promise<Result> {
  try {
    const notes = await authRequest<NoteProps[]>({
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/note/getByMonth`,
      params: { year, month },
    });

    return { success: true, message: "成功", notes };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "讀取資料失敗，請稍後再試",
      notes: [],
    };
  }
}
