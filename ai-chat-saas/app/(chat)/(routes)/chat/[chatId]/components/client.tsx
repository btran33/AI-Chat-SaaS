"use client"

import { ChatHeader } from "@/components/chat-header"
import { Buddy, Message } from "@prisma/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { useCompletion } from "ai/react"
import { ChatForm } from "@/components/chat-form"
import { ChatMessages } from "@/components/chat-messages"

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
    const router = useRouter()
    const [messages, setMessages] = useState<any[]>(buddy.messages)

    const {
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setInput
    } = useCompletion({
        api: `/api/chat/${buddy.id}`,
        onFinish(_, completion) {
            const systemMessage = {
                role: 'system',
                content: completion
            };

            setMessages((current) => [...current, systemMessage])
            setInput("")
            router.refresh()
        }
    })

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage = {
            role: 'user',
            content: input
        }

        setMessages((current) => [...current, userMessage])
        handleSubmit(e)
    }

    return (
        <div className="flex flex-col h-screen p-4 space-y-2">
            <ChatHeader buddy={buddy}/>
            
            <ChatMessages
                buddy={buddy}
                messages={messages}
                isLoading={isLoading}
            />

            <ChatForm 
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
    )
}