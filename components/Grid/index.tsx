import { Grid2X2 } from "lucide-react";
import { useState } from "react";

type GridOption = 'preview' | 'simple' | null;

type GridProps = {
    onSelect: (option: GridOption) => void;
};

export default function Grid({ onSelect }: GridProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<GridOption>(null);

    const handleSelect = (option: 'preview' | 'simple') => {
        const next = selected === option ? null : option;
        setSelected(next);
        onSelect(next);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50">
            <button
                aria-label="Grid"
                onClick={() => setIsOpen(prev => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white
                bg-white/10 border border-white rounded-md cursor-pointer
                transition-all duration-150
                hover:bg-white/20 hover:border-white/45
                active:scale-[0.97] active:bg-white/15
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
                <Grid2X2 size={16} color="white" strokeWidth={2} />
                Grid
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 flex flex-col bg-white/80 border border-white rounded-md overflow-hidden">
                    <button
                        onClick={() => handleSelect('preview')}
                        className="px-4 py-2 text-sm text-black hover:bg-black/20 text-left cursor-pointer border-b-2 border-white"
                    >
                        {selected === 'preview' ? 'Close Preview' : 'Preview'}
                    </button>
                    <button
                        onClick={() => handleSelect('simple')}
                        className="px-4 py-2 text-sm text-black hover:bg-black/20 text-left cursor-pointer"
                    >
                        {selected === 'simple' ? 'Close Simple' : 'Simple'}
                    </button>
                </div>
            )}
        </div>
    );
}