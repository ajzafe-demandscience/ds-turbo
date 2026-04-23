import { NextResponse } from "next/server";

import { getNavigationData } from "@/lib/navigation";

export const revalidate = 360; // every 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variant = searchParams.get("variant") === "logoOnly" ? "logoOnly" : "main";
  const data = await getNavigationData(variant);
  return NextResponse.json(data);
}
