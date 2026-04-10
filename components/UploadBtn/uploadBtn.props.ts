export interface UploadBtnProps {
    onCreateText: (text: string) => Promise<void>
    onCreateFile: (file: { path: string; width: number; height: number }) => Promise<void>
}