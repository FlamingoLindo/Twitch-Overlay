import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const item = await tx.item.findUnique({
        where: { id },
        include: { textItem: true, fileItem: true },
      });

      if (!item) {
        throw new Error("NOT_FOUND");
      }

      if (item.textItem) {
        await tx.textItem.delete({ where: { itemId: id } });
      }

      if (item.fileItem) {
        await tx.fileItem.delete({ where: { itemId: id } });
      }

      await tx.item.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
