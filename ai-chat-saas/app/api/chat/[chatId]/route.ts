import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { CallbackManager } from 'langchain/callbacks'
import { Replicate } from 'langchain/llms/replicate'
import { NextResponse } from "next/server";

import { MemoryManager, BuddyKey } from "@/lib/memory-services";
import { rateLimit } from "@/lib/rate-limit";
import prismaDB from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: {chatId: string} }
) {
    try {
        const { prompt } = await req.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // rate limit specific user
        const identifier = `${req.url}-${user.id}`
        const { success } = await rateLimit(identifier);
        
        if (!success) {
            return new NextResponse('Rate limit exceeded', { status: 429 })
        }

        // update the buddy with new messages
        const buddy = await prismaDB.buddy.update({
            where: {
                id: params.chatId,
                userId: user.id
            },
            data: {
                messages: {
                    create: {
                        role: 'user',
                        content: prompt,
                        userId: user.id
                    }
                }
            }
        })

        if (!buddy) {
            return new NextResponse('Buddy not found', { status: 404 })
        }

        const name = buddy.id;
        const buddy_file_name = `${name}.txt`
        const buddyKey: BuddyKey = {
            buddyName: name,
            userId: user.id,
            modelName: 'llama2-13b'
        }

        const memoryManager = await MemoryManager.getInstance()
        const record = await memoryManager.readLatestHistory(buddyKey)
        // seed chat history if no conversation history is there
        if (record.length === 0) {
            memoryManager.seedChatHistory(
                buddy.seed,
                '\n\n',
                buddyKey
            )
        }

        // write to chat history, read it, and vector query for similar docs
        await memoryManager.writeToHistory(`User: ${prompt}\n`, buddyKey);
        const recentChatHistory = await memoryManager.readLatestHistory(buddyKey);
        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory, 
            buddy_file_name
        );

        let relevantHistory = '';

        if (!!similarDocs && similarDocs.length !== 0){
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n')
        }

        

    } catch (error) {
        console.log('[CHAT_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}