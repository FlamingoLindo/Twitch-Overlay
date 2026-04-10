'use client'
import DraggableItems from '@/components/DraggableItems';
import UploadBtn from '@/components/UploadBtn';
import { createFileItem, createTextItem, deleteItem, fetchItems, updateItem } from '@/services/canvas.service';
import { ApiItem, DraggableItem, FilePayload, UpdatePayload } from '@/types/front-end/canvas.dto';
import { useEffect, useState } from 'react';

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

  const handleCreateText = async (text: string) => {
    const created = await createTextItem(text)
    setItems((prev) => [...prev, created])
  }

  const handleCreateFile = async (file: FilePayload) => {
    const created = await createFileItem(file)
    setItems((prev) => [...prev, created])
  }

  const handleRemove = async (id: string) => {
    await deleteItem(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  const handleUpdate = async (id: string, type: 'text' | 'file', update: UpdatePayload) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        if (item.type === 'file') return { ...item, coordinates: { x: update.x, y: update.y }, file: { ...item.file, width: update.width, height: update.height } }
        return { ...item, coordinates: { x: update.x, y: update.y } }
      }),
    )
    await updateItem(id, type, update)
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