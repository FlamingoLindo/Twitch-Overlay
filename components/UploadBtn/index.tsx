import { Plus } from "lucide-react";
import { useState } from "react";
import UploadMenu from "./UploadMenu";
import { UploadBtnProps } from "@/components/UploadBtn/uploadBtn.props";

export default function UploadBtn({ onCreateText, onCreateFile }: UploadBtnProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="z-50">
            <button
                aria-label="Upload file"
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-950
            bg-white/10 border border-green-800/25 rounded-md cursor-pointer
            transition-all duration-150
            hover:bg-white/20 hover:border-white/45
            active:scale-[0.97] active:bg-white/15
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
                <Plus size={16} color="green" strokeWidth={2} />
                Add
            </button>

            {isOpen && (
                <UploadMenu
                    onClose={() => setIsOpen(false)}
                    onCreateText={onCreateText}
                    onCreateFile={onCreateFile}
                />
            )}
        </div>
    );
}