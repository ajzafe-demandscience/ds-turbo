import { NextResponse } from "next/server";

import { getFooterData } from "@/lib/footer";

export const revalidate = 360;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variant =
    searchParams.get("variant") === "copyrightOnly"
      ? "copyrightOnly"
      : "main";
  const data = await getFooterData(variant);
  return NextResponse.json(data);
}
