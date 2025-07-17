import authRequest from "../../utils/authRequest";

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
  try {
    await authRequest({
      method: "POST",
      url: `${import.meta.env.VITE_API_URL}/note/update/${id}`,
      data: { title, description, tags },
    });

    return { success: true, message: "成功" };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "更新失敗，請稍後再試",
    };
  }
}
