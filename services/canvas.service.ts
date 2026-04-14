import { mapApiItemToDraggable } from '@/lib/canvas'
import type { CreateTextBody } from '@/types/api/add/createTextBody.dto'
import type { ApiItem, DraggableItem, FilePayload, UpdatePayload } from '@/types/front-end/canvas.dto'

export const fetchItems = async (): Promise<DraggableItem[]> => {
    const res = await fetch('/api')
    if (!res.ok) throw new Error('Failed to fetch items')
    const data: ApiItem[] = await res.json()
    return data.map(mapApiItemToDraggable)
}

export const createTextItem = async (text: string, fontSize = '50'): Promise<DraggableItem> => {
    const body: CreateTextBody = { type: 'text', x: 60, y: 60, text, fontSize }
    const res = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

export const fetchVisibleItems = async (): Promise<DraggableItem[]> => {
    const res = await fetch('/api?hidden=false')
    if (!res.ok) throw new Error('Failed to fetch items')
    const data: ApiItem[] = await res.json()
    return data.map(mapApiItemToDraggable)
}

export const changeVisibility = async (id: string): Promise<DraggableItem> => {
    const res = await fetch(`/api/${id}/visibility`, {
        method: 'PATCH',
    })
    if (!res.ok) throw new Error('Failed to change visibility')
    return mapApiItemToDraggable(await res.json())
}