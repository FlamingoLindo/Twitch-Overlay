'use client'
import DraggableItems from '@/components/DraggableItems';
import { clientId } from '@/lib/clientId';
import { getSocket } from '@/lib/socket';
import { fetchVisibleItems } from '@/services/canvas.service';
import { DraggableItem, UpdatePayload } from '@/types/front-end/canvas.dto';
import { useEffect, useState } from 'react';

const socket = getSocket();

export default function Overlay() {
    const [items, setItems] = useState<DraggableItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisibleItems()
            .then(setItems)
            .catch((err) => console.error('Failed to fetch items:', err))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        const onDelete = (payload: { clientId: string; itemId: string }) => {
            if (payload.clientId === clientId) return
            setItems((prev) => prev.filter((item) => item.id !== payload.itemId))
        }

        socket.on('item:delete', onDelete)
        return () => { socket.off('item:delete', onDelete) }
    }, [])

    useEffect(() => {
        const onCreate = (payload: { clientId: string; item: DraggableItem }) => {
            if (payload.clientId === clientId) return
            if (payload.item.hidden) return
            setItems((prev) => [...prev, payload.item])
        }

        socket.on('item:create', onCreate)
        return () => { socket.off('item:create', onCreate) }
    }, [])

    useEffect(() => {
        const onUpdate = (payload: { clientId: string; id: string; type: 'text' | 'file'; update: UpdatePayload }) => {
            if (payload.clientId === clientId) return
            applyUpdate(payload.id, payload.type, payload.update)
        }

        socket.on('item:update', onUpdate)
        return () => { socket.off('item:update', onUpdate) }
    }, [])

    useEffect(() => {
        const onVisibility = (payload: { clientId: string; item: DraggableItem }) => {
            if (payload.clientId === clientId) return

            setItems((prev) => {
                const existing = prev.find((i) => i.id === payload.item.id)

                if (payload.item.hidden) {
                    return prev.filter((i) => i.id !== payload.item.id)
                }

                if (existing) {
                    return prev.map((i) => (i.id === payload.item.id ? payload.item : i))
                }

                return [...prev, payload.item]
            })
        }

        socket.on('item:visibility', onVisibility)
        return () => { socket.off('item:visibility', onVisibility) }
    }, [])

    const applyUpdate = (id: string, type: 'text' | 'file', update: UpdatePayload) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item
                if (item.type === 'file') {
                    if (!('width' in update) || !('height' in update)) return item
                    return {
                        ...item,
                        coordinates: { x: update.x, y: update.y },
                        file: { ...item.file, width: update.width, height: update.height },
                    }
                }
                if (!('fontSize' in update)) return item
                return {
                    ...item,
                    coordinates: { x: update.x, y: update.y },
                    text: { ...item.text, fontSize: update.fontSize },
                }
            }),
        )
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="flex flex-col flex-1 items-start justify-start  font-sans ">
            <main
                className="flex flex-1 w-full flex-col items-start justify-start  "
            >
                <div className="relative w-480 h-270">
                    {items.map((item) => (
                        <DraggableItems
                            key={item.id}
                            selected={false}
                            onSelect={() => { }}
                            onUpdate={() => { }}
                            onRemove={() => { }}
                            interactive={false}
                            {...item}
                        />
                    ))}
                </div>

            </main>
        </div>
    );
}