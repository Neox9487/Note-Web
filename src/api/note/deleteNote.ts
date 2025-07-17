import authRequest from "../../utils/authRequest";

type Result = {
  success: boolean;
  message: string;
};

export default async function deleteNote(id: number): Promise<Result> {
  try {
    await authRequest({
      method: "DELETE",
      url: `${import.meta.env.VITE_API_URL}/note/${encodeURIComponent(id)}`,
    });

    return { success: true, message: "成功" };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "刪除筆記失敗",
    };
  }
}
