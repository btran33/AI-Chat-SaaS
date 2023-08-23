import prismaDB from "@/lib/prismadb";
import { Categories } from "@/components/categories";

const RootPage = async () => {
    const category = await prismaDB.category.findMany()
    
    return ( 
        <div className="h-full p-4 space-y-2">
            <Categories data={category} />
        </div>
     );
}
 
export default RootPage;