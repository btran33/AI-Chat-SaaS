"use client"

import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/nextjs"
import { Sparkles } from "lucide-react"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { MobileSidebar } from "./mobile-sidebar"
import { SearchInput } from "./search-input"
import { useProModal } from "@/hooks/use-pro-modal"

const font = Poppins({
    weight: "600",
    subsets: ["latin"]
})

export const Navbar = () => {
    const proModal = useProModal()

    return (
        <div className="fixed grid grid-flow-col w-full z-50 items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar/>
                <Link href="/">
                    <h1 className={cn(
                        "hidden md:block text-xl md:text-3xl font-bold text-primary",
                        font.className
                    )}>
                        AI.buddy
                    </h1>
                </Link>
            </div>

            <div>
                <SearchInput/>
            </div>

            <div className="flex items-center gap-x-3 justify-end">
                <Button size="sm" variant="premium" onClick={proModal.onOpen}>
                    Upgrade
                    <Sparkles className="h-4 w-4 fill-white text-white ml-2"/>
                </Button>
                <ModeToggle/>
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    )
}