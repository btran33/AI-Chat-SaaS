import { Redis } from '@upstash/redis'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { PineconeClient } from '@pinecone-database/pinecone'

export type BuddyKey = {
    buddyName: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: PineconeClient;

    /**
     * Constructor to create chat history from Redis,
     * and vector DB client from Pinecone
     */
    public constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new PineconeClient();
    }

    /**
     * Initialize the Pinecone DB client
     */
    public async init() {
        if (this.vectorDBClient instanceof PineconeClient) {
            await this.vectorDBClient.init({
                apiKey: process.env.PINECONE_API_KEY!,
                environment: process.env.PINECONE_ENVIRONMENT!
            });
        }
    }

    /**
     * An asynchronous search function to the Pinecone store
     * for similar docs, given the input (chat history and buddy's file name)
     * @param recentChatHistory a string representing the chat history
     * @param buddyFileName a string representing the buddy's filename
     * @returns a list of similar documents from the search of the Pinecone vector DB 
     */
    public async vectorSearch(
        recentChatHistory: string,
        buddyFileName: string
    ) {
        const pineconeClient = <PineconeClient>this.vectorDBClient;

        const pineconeIndex = pineconeClient.Index(
            process.env.PINECONE_INDEX || ''
        );

        const vectorstores = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({
                openAIApiKey: process.env.OPENAI_API_KEY
            }),
            { pineconeIndex }
        );

        const similarDocs = await vectorstores
            .similaritySearch(
                recentChatHistory,
                3,
                { filename: buddyFileName }
            ).catch((err) => {
                console.log('Failed to get vector search results: ', err);
            });

        return similarDocs;
    }

    /**
     * A static function to return an instance of Memory Manager,
     * initializing one if there is not an existing instance already
     * @returns a Memory Manager instance
     */
    public static async getInstance() : Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
            await MemoryManager.instance.init()
        }

        return MemoryManager.instance;
    }

    
}