'use client'
import DraggableItems from '@/components/DraggableItems';
import UploadBtn from '@/components/UploadBtn';
import { useEffect, useState } from 'react';

type DraggableItem =
  | { id: string; type: 'text'; coordinates: { x: number; y: number }; text: { id: string; text: string } }
  | { id: string; type: 'file'; coordinates: { x: number; y: number }; file: { id: string; path: string; width: number; height: number } }

type ApiItem = {
  id: string
  type: 'text' | 'file'
  x: number
  y: number
  textItem: { id: string; text: string } | null
  fileItem: { id: string; path: string; width: number; height: number } | null
}

const mapApiItemToDraggable = (item: ApiItem): DraggableItem => ({
  id: item.id,
  type: item.type,
  coordinates: { x: item.x, y: item.y },
  text: item.textItem ? { id: item.textItem.id, text: item.textItem.text } : undefined,
  file: item.fileItem
    ? {
      id: item.fileItem.id,
      path: item.fileItem.path,
      width: item.fileItem.width,
      height: item.fileItem.height,
    }
    : undefined,
} as DraggableItem)

export default function Home() {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch items')
        return res.json()
      })
      .then((data: ApiItem[]) => {
        setItems(data.map(mapApiItemToDraggable))
      })
      .catch((err) => console.error('Failed to fetch items:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCreateText = async (text: string) => {
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'text', x: 60, y: 60, text }),
    })
    if (!res.ok) {
      throw new Error('Failed to create text item')
    }
    const created: ApiItem = await res.json()
    setItems((prev) => [...prev, mapApiItemToDraggable(created)])
  }

  const handleCreateFile = async (file: { path: string; width: number; height: number }) => {
    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'file',
        x: 100,
        y: 100,
        path: file.path,
        width: file.width,
        height: file.height,
      }),
    })

    if (!res.ok) {
      throw new Error('Failed to create file item')
    }

    const created: ApiItem = await res.json()
    setItems((prev) => [...prev, mapApiItemToDraggable(created)])
  }

  const handleRemove = async (id: string) => {
    const res = await fetch(`/api/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      throw new Error('Failed to delete item')
    }
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  const handleUpdate = async (
    id: string,
    type: 'text' | 'file',
    update: { x: number; y: number; width: number; height: number },
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item

        if (item.type === 'file') {
          return {
            ...item,
            coordinates: { x: update.x, y: update.y },
            file: {
              ...item.file,
              width: update.width,
              height: update.height,
            },
          }
        }

        return {
          ...item,
          coordinates: { x: update.x, y: update.y },
        }
      }),
    )

    const res = await fetch(`/api/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...update }),
    })

    if (!res.ok) {
      throw new Error('Failed to update item')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main
        className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start"
        onMouseDown={() => setSelectedId(null)}
      >
        <UploadBtn onCreateText={handleCreateText} onCreateFile={handleCreateFile} />
        {items.map((item) => (
          <DraggableItems
            key={item.id}
            selected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            onUpdate={(update) => {
              handleUpdate(item.id, item.type, update).catch((err) => {
                console.error('Update failed:', err)
              })
            }}
            onRemove={() => {
              handleRemove(item.id).catch((err) => {
                console.error('Delete failed:', err)
              })
            }}
            {...item}
          />
        ))}
      </main>
    </div>
  );
}