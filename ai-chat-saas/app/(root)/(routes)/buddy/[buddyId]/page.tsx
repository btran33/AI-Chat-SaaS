import prismaDB from "@/lib/prismadb";
import { BuddyForm } from "./components/buddy-form";

interface BuddyIdPageProps{
    params: {
        buddyId: string
    }
}

const CompanionId = async ({
    params
}: BuddyIdPageProps) => {
    // TODO: check subscription

    const buddy = await prismaDB.buddy.findUnique({
        where: {
            id: params.buddyId
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
 
export default CompanionId;