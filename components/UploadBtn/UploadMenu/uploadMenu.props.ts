export interface UploadMenuProps {
    onClose: () => void;
    onCreateText: (text: string) => Promise<void>;
    onCreateFile: (file: { path: string; width: number; height: number }) => Promise<void>;
}
