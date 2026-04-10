import { mapApiItemToDraggable } from '@/lib/canvas'
import type { ApiItem, DraggableItem, FilePayload, UpdatePayload } from '@/types/front-end/canvas.dto'

export const fetchItems = async (): Promise<DraggableItem[]> => {
    const res = await fetch('/api')
    if (!res.ok) throw new Error('Failed to fetch items')
    const data: ApiItem[] = await res.json()
    return data.map(mapApiItemToDraggable)
}

export const createTextItem = async (text: string): Promise<DraggableItem> => {
    const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', x: 60, y: 60, text }),
    })
    if (!res.ok) throw new Error('Failed to create text item')
    return mapApiItemToDraggable(await res.json())
}

export const createFileItem = async (file: FilePayload): Promise<DraggableItem> => {
    const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'file', x: 100, y: 100, ...file }),
    })
    if (!res.ok) throw new Error('Failed to create file item')
    return mapApiItemToDraggable(await res.json())
}

export const deleteItem = async (id: string): Promise<void> => {
    const res = await fetch(`/api/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete item')
}

export const updateItem = async (
    id: string,
    type: 'text' | 'file',
    update: UpdatePayload,
): Promise<void> => {
    const res = await fetch(`/api/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...update }),
    })
    if (!res.ok) throw new Error('Failed to update item')
}