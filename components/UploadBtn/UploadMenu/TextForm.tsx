import { TextFormProps } from "@/types/front-end/textForm.interface"
import { useState } from "react"

export default function TextForm({ onSubmit }: TextFormProps) {
    const [text, setText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        const trimmed = text.trim()
        if (!trimmed || isSubmitting) return
        setIsSubmitting(true)
        try {
            await onSubmit(trimmed)
            setText("")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-1.5">
                <textarea
                    rows={5}
                    spellCheck="false"
                    placeholder="Enter text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full resize-none px-3 py-2.5 text-sm text-zinc-900
                    bg-zinc-50 border border-zinc-200 rounded-md
                    placeholder:text-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:border-zinc-400
                    transition-colors duration-150"
                />
            </div>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || text.trim().length === 0}
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