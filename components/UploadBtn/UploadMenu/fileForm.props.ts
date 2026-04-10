export interface FilePreview {
    url: string
    name: string
    size: string
}

export interface FileFormProps {
    onSubmit: (file: { path: string; width: number; height: number }) => Promise<void>
}
