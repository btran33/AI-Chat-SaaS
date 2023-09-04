import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface BotAvatarProps {
    src : string
}

/**
 * Reusable avatar component that accepts a src image
 * @param src a string representing the image source
 * @returns an Avatar component with the image from source
 */
export const BotAvatar = ({
    src
}: BotAvatarProps) => {
    return (
        <Avatar className="h-12 w-12">
            <AvatarImage src={src}/>
        </Avatar>
    )
}