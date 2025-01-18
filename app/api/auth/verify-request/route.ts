import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { headers } = req;
  const referer = headers.get("referer");

  redirect(`${referer}/success`);
}
