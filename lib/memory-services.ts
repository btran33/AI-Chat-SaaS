import { Redis } from '@upstash/redis'
// import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
// import { PineconeStore } from 'langchain/vectorstores/pinecone'
// import { PineconeClient } from '@pinecone-database/pinecone'

export type BuddyKey = {
    buddyName: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    // private vectorDBClient: PineconeClient;

    /**
     * Constructor to create chat history from Redis,
     * and vector DB client from Pinecone
     */
    public constructor() {
        this.history = Redis.fromEnv();
        // this.vectorDBClient = new PineconeClient();
    }

    /**
     * Initialize the Pinecone DB client
     */
    // public async init() {
    //     if (this.vectorDBClient instanceof PineconeClient) {
    //         await this.vectorDBClient.init({
    //             apiKey: process.env.PINECONE_API_KEY!,
    //             environment: process.env.PINECONE_ENVIRONMENT!
    //         });
    //     }
    // }

    /**
     * An asynchronous search function to the Pinecone store
     * for similar docs, given the input (chat history and buddy's file name)
     * @param recentChatHistory a string representing the chat history
     * @param buddyFileName a string representing the buddy's filename
     * @returns a list of similar documents from the search of the Pinecone vector DB 
     */
    // public async vectorSearch(
    //     recentChatHistory: string,
    //     buddyFileName: string
    // ) {
    //     const pineconeClient = <PineconeClient>this.vectorDBClient;

    //     const pineconeIndex = pineconeClient.Index(
    //         process.env.PINECONE_INDEX || ''
    //     );

    //     const vectorstores = await PineconeStore.fromExistingIndex(
    //         new OpenAIEmbeddings({
    //             openAIApiKey: process.env.OPENAI_API_KEY
    //         }),
    //         { pineconeIndex }
    //     );

    //     const similarDocs = await vectorstores
    //         .similaritySearch(
    //             recentChatHistory,
    //             3,
    //             { filename: buddyFileName }
    //         ).catch((err) => {
    //             console.log('Failed to get vector search results: ', err);
    //         });

    //     return similarDocs;
    // }

    /**
     * A public function to return an instance of Memory Manager,
     * initializing one if there is not an existing instance already
     * @returns a Memory Manager instance
     */
    public static async getInstance() : Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
            // await MemoryManager.instance.init()
        };

        return MemoryManager.instance;
    }

    /**
     * A private fucntion to generate a Redis key for a Buddy
     * @param buddyKey a Prop containing the name, model, and userId of the AI Buddy
     * @returns a string representing the Redis key for the Buddy
     */
    private generateRedisBuddyKey(buddyKey: BuddyKey): string {
        return `${buddyKey.buddyName}-${buddyKey.modelName}-${buddyKey.userId}`;
    }

    /**
     * A public function to write the text input (user or system) to
     * Redis chat history
     * @param input the text input, in string
     * @param buddyKey the Prop containing the name, model, and userId of the AI Buddy
     * @returns a Promise result on the write operation
     */
    public async writeToHistory(
        input: string,
        buddyKey: BuddyKey
    ) {
        if (!buddyKey || typeof buddyKey.userId == 'undefined') {
            console.log('Buddy key set incorrectly...');
            return '';
        }

        const key = this.generateRedisBuddyKey(buddyKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: input,
        });

        return result;
    }

    /**
     * A public function to query the latest chat history from Redis
     * @param buddyKey the Prop containing the name, model, and userId of the AI Buddy
     * @returns a string containing the chat history
     */
    public async readLatestHistory(buddyKey: BuddyKey) : Promise<string>{
        if (!buddyKey || typeof buddyKey.userId == 'undefined') {
            console.log('Buddy key set incorrectly...');
            return '';
        }

        const key = this.generateRedisBuddyKey(buddyKey)
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true
        });

        // modify vector db result to usable format
        result = result.slice(-30).reverse();
        const recentChat = result.reverse().join('\n');

        return recentChat;
    }

    /**
     * A public function to seed the chat history to Redis 
     * @param seedContent the seed in string
     * @param delimiter the delimiter of the seed
     * @param buddyKey the Prop containing the name, model, and userId of the AI Buddy
     */
    public async seedChatHistory(
        seedContent: string,
        delimiter: string = '\n',
        buddyKey: BuddyKey
    ) {
        const key = this.generateRedisBuddyKey(buddyKey);
     
        if (await this.history.exists(key)) {
            console.log('User already has chat history');
            return;
        }

        const content = seedContent.split(delimiter);
        let count = 0;

        for (const line of content) {
            await this.history.zadd(key, {
                score: count,
                member: line
            })
            count += 1
        }
    }

    /**
     * A public function to delete the Redis chat history of a buddy 
     * @param buddyKey the Prop containing the name, model, and userId of the AI Buddy
     */
    public async deleteHistory(
        buddyKey: BuddyKey        
    ) {
        try {
            if (!buddyKey || typeof buddyKey.userId == 'undefined') {
                console.log('Buddy key set incorrectly...');
                return
            }
    
            const key = this.generateRedisBuddyKey(buddyKey);
            await this.history.del(key)
        } catch (error) {
            console.log('[REDIS_DEL]', error)
        }
    }
}