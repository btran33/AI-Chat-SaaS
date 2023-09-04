import prismaDB from "@/lib/prismadb";
import { BuddyForm } from "./components/buddy-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface BuddyIdPageProps{
    params: {
        buddyId: string
    }
}

const BuddyId = async ({
    params
}: BuddyIdPageProps) => {
    // TODO: check subscription
    
    const { userId } = auth()
    if (!userId) {
        return redirectToSignIn()
    }

    const buddy = await prismaDB.buddy.findUnique({
        where: {
            id: params.buddyId,
            userId
        }
    })

    const category = await prismaDB.category.findMany()

    return ( 
        <BuddyForm
            initialData={buddy}
            category={category}
        />
     );
}
 
export default BuddyId;