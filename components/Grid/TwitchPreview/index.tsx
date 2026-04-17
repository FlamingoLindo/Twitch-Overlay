const TTV_CHANNEL = process.env.TTV_CHANNEL;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

export default function TwitchPreview() {
    return (
        <div className="w-full h-full">
            <iframe
                src={`https://player.twitch.tv/?channel=${TTV_CHANNEL}&parent=${DOMAIN_NAME}&muted=true`}
                width="100%"
                height="100%"
                className="w-full h-full"
            />
        </div>
    )
}