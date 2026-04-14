'use client'
import DraggableItems from '@/components/DraggableItems';
import Grid from '@/components/Grid';
import UploadBtn from '@/components/UploadBtn';
import { clientId } from '@/lib/clientId';
import { debounce } from '@/lib/debounce';
import { getSocket } from '@/lib/socket';
import { changeVisibility, createFileItem, createTextItem, deleteItem, fetchItems, updateItem } from '@/services/canvas.service';
import { DraggableItem, FilePayload, UpdatePayload } from '@/types/front-end/canvas.dto';
import { useEffect, useMemo, useState } from 'react';

const socket = getSocket();

export default function Home() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .catch((err) => console.error('Failed to fetch items:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onDelete = (payload: { clientId: string; itemId: string }) => {
      if (payload.clientId === clientId) return
      setItems((prev) => prev.filter((item) => item.id !== payload.itemId))
      setSelectedId((prev) => (prev === payload.itemId ? null : prev))
    }

    socket.on('item:delete', onDelete)
    return () => { socket.off('item:delete', onDelete) }
  }, [])

  useEffect(() => {
    const onCreate = (payload: { clientId: string; item: DraggableItem }) => {
      if (payload.clientId === clientId) return
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
        if (!existing) return [...prev, payload.item]
        return prev.map((i) => (i.id === payload.item.id ? payload.item : i))
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

  const debouncedPersist = useMemo(
    () => debounce((id: string, type: 'text' | 'file', update: UpdatePayload) => {
      updateItem(id, type, update).catch((err) => console.error('Persist failed:', err))
    }, 100),
    [],
  )

  useEffect(() => {
    return () => { debouncedPersist.cancel() }
  }, [debouncedPersist])

  const handleCreateText = async (text: string) => {
    const created = await createTextItem(text)
    setItems((prev) => [...prev, created])
    socket.emit('item:create', { clientId, item: created })
  }

  const handleCreateFile = async (file: FilePayload) => {
    const created = await createFileItem(file)
    setItems((prev) => [...prev, created])
    socket.emit('item:create', { clientId, item: created })
  }

  const handleRemove = async (id: string) => {
    await deleteItem(id)
    socket.emit('item:delete', { clientId, itemId: id })
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  const handleUpdate = (id: string, type: 'text' | 'file', update: UpdatePayload) => {
    applyUpdate(id, type, update)
    socket.emit('item:update', { clientId, id, type, update })
    debouncedPersist(id, type, update)
  }

  const handleToggleHidden = async (id: string) => {
    const updated = await changeVisibility(id)
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex flex-col flex-1 items-start justify-start bg-zinc-50 font-sans dark:bg-green-400">
      <main
        className="flex flex-1 w-full flex-col items-start justify-start bg-white dark:bg-green-400"
        onMouseDown={() => setSelectedId(null)}
      >
        <UploadBtn onCreateText={handleCreateText} onCreateFile={handleCreateFile} />
        <div className="relative w-480 h-270">
          <Grid />
          {items.map((item) => (
            <DraggableItems
              key={item.id}
              selected={selectedId === item.id}
              onSelect={() => setSelectedId(item.id)}
              onUpdate={(update) => handleUpdate(item.id, item.type, update)}
              onToggleHidden={() => {
                handleToggleHidden(item.id).catch((err) => console.error('Visibility failed:', err))
              }}
              onRemove={() => {
                handleRemove(item.id).catch((err) => console.error('Delete failed:', err))
              }}
              {...item}
            />
          ))}
        </div>

      </main>
    </div>
  );
}