export interface ItemsProps {
    selected: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onUpdate: (update: { x: number; y: number; width: number; height: number }) => void;
    type: 'text' | 'file'
    coordinates: {
        x: number,
        y: number
    }
    text?: {
        id: string,
        text: string
    },
    file?: {
        id: string,
        path: string,
        width: number,
        height: number,
    }
}