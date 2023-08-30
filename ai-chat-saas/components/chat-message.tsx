"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { PulseLoader } from "react-spinners"
import { Copy } from "lucide-react"

import { BotAvatar } from "@/components/bot-avatar"
import { UserAvatar } from "@/components/user-avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

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
        <div className={cn(
            "group flex items-start gap-x-3 py-4 w-full",
            role === 'user' && 'justify-end'
        )}>
            {role !== 'user' && src && <BotAvatar src={src}/>}

            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {isLoading
                    ? <PulseLoader  
                        color={theme === 'light' ? 'black' : 'white'}
                        size={6}
                     /> 
                    : content
                }
            </div>

            {role !== 'user' && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >   
                    <Copy className="w-4 h-4"/>
                </Button>
            )}

            {role === 'user' && <UserAvatar/>}
        </div>
    )
}