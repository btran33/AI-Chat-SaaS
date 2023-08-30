import prismaDB from "@/lib/prismadb"
import { currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { buddyId : string }}
) {
    try {
        const body = await req.json()
        const user = await currentUser()
        const { src, name, description, instruction, seed, categoryId } = body

        if (!params.buddyId) {
            return new NextResponse('Buddy ID is required', { status: 400 })
        }

        // validate authorization and fields
        if (!user || !user.id || !user.firstName) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!src || !name || !description || !instruction || !seed || !categoryId) {
            return new NextResponse('Missing required field(s)', { status: 400 })
        }

        // TODO: check subscription

        const buddy = await prismaDB.buddy.update({
            where: {
                id: params.buddyId
            },
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
        console.log("[BUDDY_PATCH]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}