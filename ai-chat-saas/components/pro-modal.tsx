'use client'

import { useProModal } from "@/hooks/use-pro-modal"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader 
} from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

export const ProModal = () => {
    const proModal = useProModal()

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}