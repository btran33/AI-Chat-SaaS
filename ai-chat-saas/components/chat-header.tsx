"use client"

import { Buddy, Message } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MessagesSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { BotAvatar } from "@/components/bot-avatar"

interface ChatHeaderProps {
    buddy: Buddy & {
        messages: Message[],
        _count: {
            messages: number
        }
    }
}

export const ChatHeader = ({
    buddy
}: ChatHeaderProps) => {
    const router = useRouter()

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center"> 
                <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-8 w-8"/>
                </Button>

                <BotAvatar src={buddy.src}/>

                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">
                            {buddy.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1"/>
                            {buddy._count.messages}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Created by {buddy.userName}
                    </p>
                </div>
            </div>
        </div>
    )
}