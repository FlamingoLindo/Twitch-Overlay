import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = {
    params: Promise<{ id: string }>
}

type PatchTextBody = {
    type: 'text'
    x: number
    y: number
}

type PatchFileBody = {
    type: 'file'
    x: number
    y: number
    width: number
    height: number
}

type PatchBody = PatchTextBody | PatchFileBody

const isFiniteNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value)

function validatePatchBody(body: unknown): { ok: true; data: PatchBody } | { ok: false; error: string } {
    if (!body || typeof body !== 'object') {
        return { ok: false, error: 'Body must be an object' }
    }

    const b = body as Record<string, unknown>
    if (b.type !== 'text' && b.type !== 'file') {
        return { ok: false, error: 'Invalid type' }
    }
    if (!isFiniteNumber(b.x) || !isFiniteNumber(b.y)) {
        return { ok: false, error: 'x and y must be numbers' }
    }
    if (b.type === 'file') {
        if (!isFiniteNumber(b.width) || !isFiniteNumber(b.height)) {
            return { ok: false, error: 'width and height must be numbers for file updates' }
        }
        return {
            ok: true,
            data: { type: 'file', x: b.x, y: b.y, width: b.width, height: b.height },
        }
    }

    return {
        ok: true,
        data: { type: 'text', x: b.x, y: b.y },
    }
}

export async function PATCH(req: Request, { params }: Params) {
    try {
        const { id } = await params
        const body = await req.json()
        const parsed = validatePatchBody(body)

        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.error }, { status: 400 })
        }

        const payload = parsed.data

        const updated = await prisma.$transaction(async (tx) => {
            const exists = await tx.item.findUnique({ where: { id } })
            if (!exists) {
                throw new Error('NOT_FOUND')
            }

            await tx.item.update({
                where: { id },
                data: {
                    x: payload.x,
                    y: payload.y,
                },
            })

            if (payload.type === 'file') {
                await tx.fileItem.update({
                    where: { itemId: id },
                    data: {
                        width: Math.round(payload.width),
                        height: Math.round(payload.height),
                    },
                })
            }

            return tx.item.findUnique({
                where: { id },
                include: { textItem: true, fileItem: true },
            })
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof Error && error.message === 'NOT_FOUND') {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { id } = await params

        await prisma.$transaction(async (tx) => {
            const item = await tx.item.findUnique({
                where: { id },
                include: { textItem: true, fileItem: true },
            })

            if (!item) {
                throw new Error('NOT_FOUND')
            }

            if (item.textItem) {
                await tx.textItem.delete({ where: { itemId: id } })
            }

            if (item.fileItem) {
                await tx.fileItem.delete({ where: { itemId: id } })
            }

            await tx.item.delete({ where: { id } })
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        if (error instanceof Error && error.message === 'NOT_FOUND') {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
    }
}
