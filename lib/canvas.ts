import type { ApiItem, DraggableItem } from '@/types/front-end/canvas.dto'

export const mapApiItemToDraggable = (item: ApiItem): DraggableItem => ({
    id: item.id,
    type: item.type,
    hidden: item.hidden,
    coordinates: { x: item.x, y: item.y },
    text: item.textItem ?? undefined,
    file: item.fileItem ?? undefined,
} as DraggableItem)