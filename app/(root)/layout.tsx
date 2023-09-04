import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { checkSubscription } from "@/lib/subscription";

const RootLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const isPro = await checkSubscription()

    return ( 
        <div className="h-full">
            <Navbar isPro={isPro}/>
            <div className="fixed hidden md:flex mt-16 w-20 flex-col inset-y-0">
                <Sidebar isPro={isPro}/>
            </div>

            <main className="pt-16 md:pl-20 h-full">
                {children}
            </main>
        </div>
     );
}
 
export default RootLayout;