export default function TwitchPreview() {
    return (
        <div className="w-full h-full">
            <iframe
                src="https://player.twitch.tv/?channel=flamingo_lindo&parent=overlay.flamingo-lindo.com.br&muted=true"
                width="100%"
                height="100%"
                className="w-full h-full"
            />
        </div>
    )
}