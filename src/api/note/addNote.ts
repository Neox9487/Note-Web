import authRequest from "../../utils/authRequest";

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
  try {
    const res = await authRequest({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/note/add`,
      data: { title, content, date, tags },
    });

    return { success: true, message: "成功", id: res.data.id };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "新增筆記失敗，請稍後再試",
      id: -1,
    };
  }
}
