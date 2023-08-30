"use client"

import { Buddy, Message } from "@prisma/client"
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { BotAvatar } from "@/components/bot-avatar"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

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
    const { user } = useUser()
    const { toast } = useToast()
    
    const onDelete = async () => {
        try {
            await axios.delete(`/api/buddy/${buddy.id}`)

            toast({
                description: 'Sucess ✔️'
            })

        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Something went wrong...'
            })
        }
    }

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

            {user?.id === buddy.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary">
                            <MoreVertical/>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={() => router.push(`/buddy/${buddy.id}`)}
                        >
                            <Edit className="w-4 h-4 mr-2"/>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete()}
                        >
                            <Trash className="w-4 h-4 mr-2"/>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}