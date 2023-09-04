'use client'

import { useProModal } from "@/hooks/use-pro-modal"
import { Dialog } from "./ui/dialog"

export const ProModal = () => {
    const proModal = useProModal()

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>

        </Dialog>
    )
}