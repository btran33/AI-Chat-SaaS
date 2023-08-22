import { Navbar } from "@/components/navbar";

const RootLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full">
            <Navbar />
            <main className="pt-16 md:pl-20 h-full">
                {children}
            </main>
        </div>
     );
}
 
export default RootLayout;