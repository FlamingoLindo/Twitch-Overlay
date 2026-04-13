import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { patchItemBodySchema } from "@/schemas/api/patch.schema"; 
import z from "zod";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const json = await req.json();
    const parsed = patchItemBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    const updated = await prisma.$transaction(async (tx) => {
      const exists = await tx.item.findUnique({ where: { id } });
      if (!exists) {
        throw new Error("NOT_FOUND");
      }

      await tx.item.update({
        where: { id },
        data: {
          x: payload.x,
          y: payload.y,
        },
      });

      if (payload.type === "file") {
        await tx.fileItem.update({
          where: { itemId: id },
          data: {
            width: Math.round(payload.width),
            height: Math.round(payload.height),
          },
        });
      } else {
        await tx.textItem.update({
          where: { itemId: id },
          data: {
            fontSize: payload.fontSize,
          },
        });
      }

      return tx.item.findUnique({
        where: { id },
        include: { textItem: true, fileItem: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}
