"use client"

import { Buddy } from "@prisma/client"
import { 
    ChatMessage, 
    ChatMessageProps 
} from "@/components/chat-message"
import { ElementRef, useEffect, useRef, useState } from "react"

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
    const scrollRef = useRef<ElementRef<'div'>>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false)
        }, 1000)

        return () => {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        scrollRef?.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages.length])

    return (
        <div className="flex-1">
            <ChatMessage
                role="system"
                src={buddy.src}
                content={`Hello, I am ${buddy.name}, ${buddy.description}`}
                isLoading={fakeLoading}
            />

            {/* map all messages to chat-message */}
            {messages.map((message) => (
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={buddy.src}
                />
            ))}

            {/* loading while api route is generating messages */}
            {isLoading && (
                <ChatMessage
                    role="system"
                    src={buddy.src}
                    isLoading
                />
            )}

            {/* scroll ref  */}
            <div ref={scrollRef}/>
        </div>
    )
}