import { StreamingTextResponse, LangChainStream } from "ai";
import { currentUser } from "@clerk/nextjs";
import { CallbackManager } from 'langchain/callbacks'
import { Replicate } from 'langchain/llms/replicate'
import { NextResponse } from "next/server";

import { MemoryManager, BuddyKey } from "@/lib/memory-services";
import { rateLimit } from "@/lib/rate-limit";
import prismaDB from "@/lib/prismadb";

const REPLICATE_MODEL = "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5"

/**
 * POST function for chat services. Will execute the following logic:
 * 
 * 1) (Redis) Rate limit the user to chat if necessary
 * 2) (MySQL) Update the user's buddy with the new messages
 * 3) Create a memory manager that:
 * ```
 *    a) (Redis) Read latest chat history and seed it if necessary
 *    b) (Redis) Write to chat history
 *    c) (Redis) Read history again and using it to 
 *    d) (Pinecone) Query vector DB for similar docs as relevant history
 * ```
 * 4) (Replicate) Create the LLM chat model
 * 5) (Replicate) Query a response from the model with preset instructions,  relevant background/chat history
 * 6) Clean up the responses
 * 7) (Redis/MySQL) Update databases with AI Buddy's new response
 * 8) Make a Streamable text response and return it
 * @param req the API request from the chat
 * @param params the object containing chatId of the url making the request
 * @returns a StreamingTextResponse of the AI Buddy's response
 */
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
        // const similarDocs = await memoryManager.vectorSearch(
        //     recentChatHistory, 
        //     buddy_file_name
        // );

        // let relevantHistory = '';
        // if (!!similarDocs && similarDocs.length !== 0){
        //     relevantHistory = similarDocs.map((doc) => doc.pageContent).join('\n')
        // }

        // create LLM chat model
        const { handlers } = LangChainStream()
        const model = new Replicate({
            model: REPLICATE_MODEL,
            input: {
                max_length: 2048
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers)
        })
        model.verbose = true

        // call the model using a preset insstructions, relevant background/chat history 
        const resp= String(
            await model.call(
                `ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.
                
                ${buddy.instruction}
                
                Below are the relevant details about ${name}'s past and conversation you are in.
                
                ${recentChatHistory}
                ${name}:`
            ).catch(console.error)
        )
        
        // clean up the response
        const cleaned = resp.replaceAll(',', '')
        const chunks = cleaned.split('\n')
        const response = chunks[0]

        // await memoryManager.writeToHistory('' + response.trim(), buddyKey)
        var Readable = require('stream').Readable

        let s = new Readable()
        s.push(response)
        s.push(null)

        if (response !== undefined && response.length > 1) {
            await memoryManager.writeToHistory('' + response.trim(), buddyKey)
            await prismaDB.buddy.update({
                where: {
                    id: params.chatId
                },
                data: {
                    messages: {
                        create: {
                            role: 'system',
                            content: response.trim(),
                            userId: user.id
                        }
                    }
                }
            })
        }

        return new StreamingTextResponse(s)
    } catch (error) {
        console.log('[CHAT_POST]', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}