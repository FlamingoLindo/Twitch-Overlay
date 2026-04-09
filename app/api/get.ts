import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.item.findMany({
    include: { textItem: true, fileItem: true },
  });
  return NextResponse.json(items);
}
