import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const onlyVisible = searchParams.get('hidden') === 'false'

    const items = await prisma.item.findMany({
        where: onlyVisible ? { hidden: false } : undefined,
        include: { textItem: true, fileItem: true },
    })
    return NextResponse.json(items)
}