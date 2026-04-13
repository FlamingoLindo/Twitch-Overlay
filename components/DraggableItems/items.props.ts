import type { UpdatePayload } from '@/types/front-end/canvas.dto'

export interface ItemsProps {
    selected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onUpdate: (update: UpdatePayload) => void;
    type: 'text' | 'file'
    coordinates: {
        x: number,
        y: number
    }
    text?: {
        id: string,
        text: string,
        fontSize: string,
    },
    file?: {
        id: string,
        path: string,
        width: number,
        height: number,
    }
}