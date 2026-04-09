import Image from "next/image";
import { useState } from "react"

type FilePreview = {
    url: string
    name: string
    size: string
}

type FileFormProps = {
    onSubmit: (file: { path: string; width: number; height: number }) => Promise<void>
}

export default function FileForm({ onSubmit }: FileFormProps) {
    const [preview, setPreview] = useState<FilePreview>()
    const [imageData, setImageData] = useState<{ path: string; width: number; height: number }>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const readFileAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(String(reader.result || ""))
            reader.onerror = () => reject(new Error("Failed to read file"))
            reader.readAsDataURL(file)
        })

    const getImageSize = (dataUrl: string) =>
        new Promise<{ width: number; height: number }>((resolve, reject) => {
            const image = new window.Image()
            image.onload = () => {
                resolve({ width: image.naturalWidth, height: image.naturalHeight })
            }
            image.onerror = () => reject(new Error("Invalid image file"))
            image.src = dataUrl
        })

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (!file.type.startsWith("image/")) {
            return
        }

        const dataUrl = await readFileAsDataUrl(file)
        const dimensions = await getImageSize(dataUrl)

        setPreview({
            url: dataUrl,
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB"
        })
        setImageData({ path: dataUrl, width: dimensions.width, height: dimensions.height })
    }

    const handleRemove = () => {
        setPreview(undefined)
        setImageData(undefined)
    }

    const handleSubmit = async () => {
        if (!imageData || isSubmitting) return
        setIsSubmitting(true)
        try {
            await onSubmit(imageData)
            setPreview(undefined)
            setImageData(undefined)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            {!preview ? (
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32
            border-2 border-dashed border-zinc-200 rounded-md cursor-pointer
            bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-400
            transition-colors duration-150"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 mb-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-sm font-medium text-zinc-500">Click to upload</span>
                    <span className="text-xs text-zinc-400 mt-1">PNG, JPG, PDF up to 10MB</span>
                    <input id="file-upload" type="file" className="hidden" onChange={handleFile} />
                </label>
            ) : (
                <div className="relative w-full rounded-md overflow-hidden border border-zinc-200">
                    <Image
                        src={preview.url || "/noImage.png"}
                        width={40}
                        height={40}
                        alt="Preview"
                        className="w-full object-cover max-h-48"
                    />
                    <div className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-t border-zinc-200">
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-zinc-700 truncate max-w-56">{preview.name}</span>
                            <span className="text-xs text-zinc-400">{preview.size}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-xs text-zinc-400 hover:text-red-500 transition-colors duration-150 cursor-pointer"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={!preview || isSubmitting}
                className="self-end px-4 py-2 text-sm font-medium text-white
          bg-zinc-900 rounded-md cursor-pointer
          hover:bg-zinc-700 active:scale-[0.97]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150"
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </div>
    )
}