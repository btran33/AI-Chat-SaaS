import prismaDB from "@/lib/prismadb"
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { ChatClient } from "./components/client"

interface ChatIdPageProps {
    params: {
        chatId: string
    }
}

const ChatIdPage = async ({
    params
}: ChatIdPageProps) => {
    const { userId } = auth()

    if (!userId) {
        return redirectToSignIn()
    }

    // fetch messages from buddy 
    const buddy = await prismaDB.buddy.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc'
                },
                where: {
                    userId
                }
            },
            _count: {
                select: {
                    messages: {
                        where: {
                            userId: userId
                        }
                    }
                }
            }
        }
    })

    if (!buddy) {
        return redirect('/')
    }

    return (
        <ChatClient buddy={buddy}/>
     );
}
 
export default ChatIdPage;