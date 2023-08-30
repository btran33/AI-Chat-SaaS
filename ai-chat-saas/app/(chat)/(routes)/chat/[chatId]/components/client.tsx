"use client"

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
        <div className="">
            Chat
        </div>
    )
}