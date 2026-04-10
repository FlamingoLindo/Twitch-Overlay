export type DraggableItem =
    | { id: string; type: 'text'; coordinates: { x: number; y: number }; text: { id: string; text: string } }
    | { id: string; type: 'file'; coordinates: { x: number; y: number }; file: { id: string; path: string; width: number; height: number } }

export type ApiItem = {
    id: string
    type: 'text' | 'file'
    x: number
    y: number
    textItem: { id: string; text: string } | null
    fileItem: { id: string; path: string; width: number; height: number } | null
}

export type FilePayload = { path: string; width: number; height: number }
export type UpdatePayload = { x: number; y: number; width: number; height: number }