import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

const RootLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full">
            <Navbar />
            <div className="fixed hidden md:flex mt-16 w-20 flex-col inset-y-0">
                <Sidebar/>
            </div>

            <main className="pt-16 md:pl-20 h-full">
                {children}
            </main>
        </div>
     );
}
 
export default RootLayout;