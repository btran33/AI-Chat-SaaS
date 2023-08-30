"use client"

import { ChatHeader } from "@/components/chat-header"
import { Buddy, Message } from "@prisma/client"

interface ChatClientProps {
    buddy: Buddy & {
        messages: Message[],
        _count: {
            messages: number
        }
    }
}

export const ChatClient = ({
    buddy
}: ChatClientProps) => {

    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader buddy={buddy}/>
        </div>
    )
}