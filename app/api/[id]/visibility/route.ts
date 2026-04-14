import { prisma } from "@/lib/prisma";
import { getIO } from "@/lib/io";
import { mapApiItemToDraggable } from "@/lib/canvas";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updated = await prisma.item.update({
      where: { id },
      data: { hidden: !existing.hidden },
      include: { textItem: true, fileItem: true },
    });

    const io = getIO();
    io?.emit("item:visibility", {
      clientId: "server",
      item: mapApiItemToDraggable(updated as never),
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update visibility" },
      { status: 500 },
    );
  }
}
