import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: { textItem: true, fileItem: true },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.$transaction([
      ...(item.textItem
        ? [prisma.textItem.delete({ where: { itemId: id } })]
        : []),
      ...(item.fileItem
        ? [prisma.fileItem.delete({ where: { itemId: id } })]
        : []),
      prisma.item.delete({ where: { id } }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
