import prismaDB from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import axios from "axios"
import crypto from "crypto"

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
                id: params.buddyId,
                userId: user.id
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
export async function DELETE(
    req: Request,
    { params }: { params: { buddyId : string }}
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const buddy = await prismaDB.buddy.delete({
            where: {
                userId,
                id: params.buddyId
            }
        })

        // cascade the delete to Cloudinary delete the Buddy's image
        const cloudinary_src = buddy.src
        await handleCloudinaryDelete(cloudinary_src)

        return NextResponse.json(buddy)
    } catch (error) {
        console.log("[BUDDY_DELETE]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export const handleCloudinaryDelete = async (CloudinaryUrl: string) => {
    // --------------Helper functions--------------
    const getPublicIdFromUrl = (url: string) => {
        const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const generateSHA1 = (data: any) => {
        const hash = crypto.createHash('sha1');
        hash.update(data);
        return hash.digest('hex');
    };

    const generateSignature = (publicId: string, timestamp: number) => {
        if (!publicId) {
            console.log('[SIGNATURE_ERROR] no public ID was given')
            return 
        }
        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    }
    // --------------------------------------------

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const timestamp = new Date().getTime();
    const publicId = getPublicIdFromUrl(CloudinaryUrl)

    const signature = generateSHA1(generateSignature(publicId!, timestamp));
    const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
        const response = await axios.post(deleteUrl, {
            public_id: publicId,
            signature: signature,
            api_key: apiKey,
            timestamp: timestamp
        })

        // console.log('[CLOUDINARY] ',response)
    } catch (error) {
        console.log('[BUDDY_DELETE]',error);
    }
}