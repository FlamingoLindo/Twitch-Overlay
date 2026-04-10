import { useState } from "react"
import TextForm from "./TextForm"
import FileForm from "./FileForm"
import { UploadMenuProps } from "@/types/front-end/uploadMenu.interface"

export default function UploadMenu({ onClose, onCreateText, onCreateFile }: UploadMenuProps) {
    const [selected, setSelected] = useState<"text" | "file">("text")

    const btnClass = (option: "text" | "file") =>
        `px-6 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer
    ${selected === option
            ? "bg-zinc-900 text-white"
            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
        }`

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-96  p-6 flex flex-col items-center  gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-3">
                    <button type="button" className={btnClass("text")} onClick={() => setSelected("text")}>
                        Text
                    </button>
                    <button type="button" className={btnClass("file")} onClick={() => setSelected("file")}>
                        File
                    </button>
                </div>

                {selected === "text" ? (
                    <TextForm
                        onSubmit={async (text) => {
                            await onCreateText(text)
                            onClose()
                        }}
                    />
                ) : (
                    <FileForm
                        onSubmit={async (file) => {
                            await onCreateFile(file)
                            onClose()
                        }}
                    />
                )}
            </div>
        </div>
    )
}