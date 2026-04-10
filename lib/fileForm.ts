function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ""))
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsDataURL(file)
    })
}

function getImageSize(dataUrl: string) {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const image = new window.Image()
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
        image.onerror = () => reject(new Error("Invalid image file"))
        image.src = dataUrl
    })
}
export const parseImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) throw new Error("Invalid image file")
    const dataUrl = await readFileAsDataUrl(file)
    const dimensions = await getImageSize(dataUrl)
    return {
        preview: {
            url: dataUrl,
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
        },
        imageData: { path: dataUrl, ...dimensions },
    }
}