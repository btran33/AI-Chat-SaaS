'use client'

import { useState } from "react"
import { Sparkles } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface SubScriptionButtonProps {
    isPro: boolean
}

export const SubScriptionButton = ({
    isPro = false
}: SubScriptionButtonProps) => {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const onClick = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')

            window.location.href = response.data.url
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Something went wrong'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button size='sm' variant={isPro ? 'default' : 'premium'} onClick={onClick} >
            {isPro ? 'Manage Subscription' : 'Upgrade'}
            {!isPro && <Sparkles className="h-4 w-4 ml-2"/>}
        </Button>
    )
}