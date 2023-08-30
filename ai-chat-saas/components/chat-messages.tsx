"use client"

import { Buddy } from "@prisma/client"
import { ChatMessage } from "@/components/chat-message"

interface ChatMessagesProps {
    buddy: Buddy,
    messages: any[],
    isLoading: boolean
}

export const ChatMessages = ({
    buddy,
    messages,
    isLoading
}: ChatMessagesProps) => {
    return (
        <div className="flex-1">
            <ChatMessage
            />
        </div>
    )
}