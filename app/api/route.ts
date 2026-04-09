import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

type CreateTextBody = {
    type: 'text'
    x: number
    y: number
    text: string
}

type CreateFileBody = {
    type: 'file'
    x: number
    y: number
    path: string
    width: number
    height: number
}

type CreateItemBody = CreateTextBody | CreateFileBody

const isFiniteNumber = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value)

function validateBody(body: unknown): { ok: true; data: CreateItemBody } | { ok: false; error: string } {
    if (!body || typeof body !== 'object') {
        return { ok: false, error: 'Body must be an object' }
    }

    const b = body as Record<string, unknown>

    if (b.type === 'text') {
        if (!isFiniteNumber(b.x) || !isFiniteNumber(b.y)) {
            return { ok: false, error: 'x and y must be numbers' }
        }
        if (typeof b.text !== 'string' || b.text.trim().length === 0) {
            return { ok: false, error: 'text is required' }
        }

        return {
            ok: true,
            data: { type: 'text', x: b.x, y: b.y, text: b.text.trim() },
        }
    }

    if (b.type === 'file') {
        if (!isFiniteNumber(b.x) || !isFiniteNumber(b.y)) {
            return { ok: false, error: 'x and y must be numbers' }
        }
        if (typeof b.path !== 'string' || b.path.trim().length === 0) {
            return { ok: false, error: 'path is required' }
        }
        if (!isFiniteNumber(b.width) || !isFiniteNumber(b.height)) {
            return { ok: false, error: 'width and height must be numbers' }
        }

        return {
            ok: true,
            data: {
                type: 'file',
                x: b.x,
                y: b.y,
                path: b.path.trim(),
                width: b.width,
                height: b.height,
            },
        }
    }

    return { ok: false, error: 'Invalid type' }
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json()
        const parsed = validateBody(json)

        if (!parsed.ok) {
            return NextResponse.json({ error: parsed.error }, { status: 400 })
        }

        const body = parsed.data

        const item =
            body.type === 'text'
                ? await prisma.item.create({
                    data: {
                        type: 'text',
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
                        type: 'file',
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
                })

        return NextResponse.json(item, { status: 201 })
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
}

export async function GET() {
    const items = await prisma.item.findMany({
        include: { textItem: true, fileItem: true },
    })
    return NextResponse.json(items)
}