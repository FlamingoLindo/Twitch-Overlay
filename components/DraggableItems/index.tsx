import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import { XCircle } from "lucide-react";
import { ItemsProps } from '@/components/DraggableItems/items.props';
import { getSocket } from '@/lib/socket';
import { clientId } from '@/lib/clientId';

const socket = getSocket();

export default function DraggableItems({ selected, onSelect, onRemove, onUpdate, type, coordinates, text, file }: ItemsProps) {
    const [size, setSize] = useState({
        width: type === 'file' && file ? file.width : 120,
        height: type === 'file' && file ? file.height : 40,
    });
    const [position, setPosition] = useState({ x: coordinates.x, y: coordinates.y });
    const fontSize = type === 'text'
        ? (Number.parseFloat(text?.fontSize ?? '20') || 20)
        : Math.min(size.width, size.height) * 0.4;

    const itemId = type === 'text' ? text?.id : file?.id;
    const lastEmit = useRef(0);

    useEffect(() => {
        setPosition({ x: coordinates.x, y: coordinates.y });
    }, [coordinates.x, coordinates.y]);

    useEffect(() => {
        if (type === 'file' && file) {
            setSize({ width: file.width, height: file.height });
        }
    }, [type, file?.width, file?.height]);

    useEffect(() => {
        const handleMove = (payload: {
            clientId: string;
            itemId: string;
            x: number;
            y: number;
            width?: number;
            height?: number;
        }) => {
            if (payload.clientId === clientId) return;
            if (payload.itemId !== itemId) return;

            setPosition({ x: payload.x, y: payload.y });
            if (payload.width && payload.height) {
                setSize({ width: payload.width, height: payload.height });
            }
        };

        socket.on('item:move', handleMove);
        return () => { socket.off('item:move', handleMove); };
    }, [itemId]);

    return (
        <div
            style={{
                position: 'absolute',
                top: position.y,
                left: position.x,
                width: size.width,
                height: size.height,
                pointerEvents: 'none'
            }}
        >
            {selected && (
                <button
                    onMouseDown={(e) => { e.stopPropagation(); onRemove(); }}
                    style={{
                        position: 'absolute',
                        top: -12,
                        left: -12,
                        zIndex: 10,
                        pointerEvents: 'all',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        lineHeight: 0,
                    }}
                >
                    <XCircle size={35} color="black" fill='white' />
                </button>
            )}

            <Rnd
                position={{ x: 0, y: 0 }}
                size={{ width: size.width, height: size.height }}
                onDrag={(_e, d) => {
                    const now = Date.now();
                    if (now - lastEmit.current < 30) return;
                    lastEmit.current = now;

                    socket.emit('item:move', {
                        clientId,
                        itemId,
                        x: position.x + d.x,
                        y: position.y + d.y,
                    });
                }}
                onDragStop={(_e, d) => {
                    const next = { x: position.x + d.x, y: position.y + d.y };
                    setPosition(next);

                    socket.emit('item:move', { clientId, itemId, x: next.x, y: next.y });

                    if (type === 'text') {
                        onUpdate({ x: next.x, y: next.y, fontSize: String(fontSize) });
                        return;
                    }
                    onUpdate({ x: next.x, y: next.y, width: size.width, height: size.height });
                }}
                onResizeStop={(_e, _dir, ref, _delta, pos) => {
                    const nextSize = { width: ref.offsetWidth, height: ref.offsetHeight };
                    const nextPosition = { x: position.x + pos.x, y: position.y + pos.y };
                    setSize(nextSize);
                    setPosition(nextPosition);

                    // Broadcast resize too
                    socket.emit('item:move', {
                        clientId,
                        itemId,
                        x: nextPosition.x,
                        y: nextPosition.y,
                        width: nextSize.width,
                        height: nextSize.height,
                    });

                    if (type === 'text') {
                        const nextFontSize = String(Math.max(8, Math.min(nextSize.width, nextSize.height) * 0.4));
                        onUpdate({ x: nextPosition.x, y: nextPosition.y, fontSize: nextFontSize });
                        return;
                    }
                    onUpdate({ x: nextPosition.x, y: nextPosition.y, width: nextSize.width, height: nextSize.height });
                }}
                className={selected ? 'border border-white' : ''}
                style={{ pointerEvents: 'all' }}
                onMouseDown={(e) => { e.stopPropagation(); onSelect(); }}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: `${fontSize}px`,
                }}>
                    {type === 'text' && text?.text}
                    {type === 'file' && file && (
                        <Image
                            src={file.path}
                            width={file.width}
                            height={file.height}
                            alt="draggable file"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            draggable={false}
                            loading="eager"
                        />
                    )}
                </div>
            </Rnd>
        </div>
    );
}