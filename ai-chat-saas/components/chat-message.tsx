"use client"

import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"

export interface ChatMessageProps{
    role: 'user' | 'system',
    src?: string
    content?: string,
    isLoading?: boolean,
}

export const ChatMessage = ({
    role,
    src,
    content,
    isLoading
}: ChatMessageProps) => {
    const { toast } = useToast()
    const { theme } = useTheme()

    const onCopy = () => {
        if (!content) { return }

        navigator.clipboard.writeText(content)
        toast({
            description: 'Copied to clipboard 📋'
        })
    }

    return (
        <div>
            msg
        </div>
    )
}