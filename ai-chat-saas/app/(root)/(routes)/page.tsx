import prismaDB from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { Buddies } from "@/components/buddies";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface RootPageProps {
    searchParams: {
        categoryId: string;
        name: string;
    }
}

const RootPage = async ({
    searchParams
}: RootPageProps) => {
    const { userId } = auth()

    if (!userId) {
        return redirectToSignIn()
    }

    // get all buddies from url params, ordered by creation date
    // and message counts of each buddy 
    const data = await prismaDB.buddy.findMany({
        where: {
            categoryId: searchParams.categoryId,
            name: {
                search: searchParams.name
            }
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
                select: {
                    messages: {
                        where: {
                            userId: userId
                        }
                    }
                },
                
            }
        }
    })

    const category = await prismaDB.category.findMany()
    
    return ( 
        <div className="h-full p-4 space-y-2">
            <Categories data={category} />
            <Buddies data={data} />
        </div>
     );
}
 
export default RootPage;