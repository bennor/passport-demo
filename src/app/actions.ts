"use server";

import { PASSPORT_COOKIE_NAME } from "@vercel/passport";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOut() {
  const cookieStore = await cookies();
  cookieStore.delete(PASSPORT_COOKIE_NAME);
  redirect("/");
}
