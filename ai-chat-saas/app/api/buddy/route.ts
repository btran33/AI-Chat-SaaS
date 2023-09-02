import prismaDB from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { handleCloudinaryDelete } from "./[buddyId]/route"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const user = await currentUser()
        const { src, name, description, instruction, seed, categoryId } = body

        // validate authorization and fields
        if (!user || !user.id || !user.firstName) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (!src || !name || !description || !instruction || !seed || !categoryId) {
            return new NextResponse('Missing required field(s)', {status: 400})
        }

        // TODO: check subscription

        const buddy = await prismaDB.buddy.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instruction,
                seed
            }
        })

        return NextResponse.json(buddy)
    } catch (error) {
        console.log("[BUDDY_POST]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        console.log('[SERVER]', body)
        const { userId } = auth()
        const { data } = body

        // validate authorization
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!data) {
            return new NextResponse('Missing required data', {status: 400})
        }

        await handleCloudinaryDelete(data)

        return NextResponse.json(data)
    } catch (error) {
        console.log("[CLOUDINARY]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}
