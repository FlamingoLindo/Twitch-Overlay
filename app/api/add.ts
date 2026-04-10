import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createItemBodySchema } from "@/schemas/api/add.schema"; 
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = createItemBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsed.error) },
        { status: 400 },
      );
    }

    const body = parsed.data;

    const item =
      body.type === "text"
        ? await prisma.item.create({
            data: {
              type: "text",
              x: body.x,
              y: body.y,
              textItem: {
                create: { text: body.text },
              },
            },
            include: { textItem: true, fileItem: true },
          })
        : await prisma.item.create({
            data: {
              type: "file",
              x: body.x,
              y: body.y,
              fileItem: {
                create: {
                  path: body.path,
                  width: body.width,
                  height: body.height,
                },
              },
            },
            include: { textItem: true, fileItem: true },
          });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
