import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const hiddenParam = req.nextUrl.searchParams.get("hidden");
  const where =
    hiddenParam === null
      ? undefined
      : hiddenParam === "true"
        ? { hidden: true }
        : hiddenParam === "false"
          ? { hidden: false }
          : undefined;

  const items = await prisma.item.findMany({
    where,
    include: { textItem: true, fileItem: true },
  });

  return NextResponse.json(items);
}