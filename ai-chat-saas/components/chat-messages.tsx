"use client"

import { Buddy } from "@prisma/client"
import { 
    ChatMessage, 
    ChatMessageProps 
} from "@/components/chat-message"
import { useEffect, useState } from "react"

interface ChatMessagesProps {
    buddy: Buddy,
    messages: ChatMessageProps[],
    isLoading: boolean
}

export const ChatMessages = ({
    buddy,
    messages,
    isLoading
}: ChatMessagesProps) => {
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false)
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    return (
        <div className="flex-1">
            <ChatMessage
                role="system"
                src={buddy.src}
                content={`Hello, I am ${buddy.name}, ${buddy.description}`}
                isLoading={fakeLoading}
            />

            {/* <ChatMessage
                role="user"
                content={`Hi ${buddy.name}`}
            /> */}
        </div>
    )
}