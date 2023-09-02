"use client"

import { useEffect, useState } from "react"
import { CldUploadButton } from "next-cloudinary"
import Image from 'next/image'
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadProps {
    value: string
    onChange: (src: string) => void
    disable?: boolean
}

export const ImageUpload = ({
    value,
    onChange,
    disable
}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [currValue, setValue] = useState(value)
    const { toast } =  useToast()

    useEffect(() => {
        setIsMounted(true)
    }, [])
     
    // prevents hydration error
    if (!isMounted) {
        return null
    }

    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton 
                onUpload={async (result: any) => {
                    try {
                        // patch the current image url on Cloudinary side
                        if (!currValue) { 
                            setValue(result.info.secure_url)
                        } else {
                            await axios.patch('/api/buddy', {data: currValue})
                            setValue(result.info.secure_url)
                        }
                        
                        onChange(result.info.secure_url)
                    } catch (error) {
                        toast({
                            variant: 'destructive',
                            description: 'Unable to delete previous image upload...'
                        })
                    }
                }}
                options={{
                    maxFiles: 1
                }}
                uploadPreset="jcrvvuxj">
                <div className="
                    p-2 border-4 border-dashed border-primary/10 rounded-lg items-center
                    hover:opacity-75 transition flex flex-col space-y-2 justify-center">
                    <div className="relative h-40 w-40">
                        <Image 
                            fill
                            alt="upload"
                            src={value || '/placeholder.svg'}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    )
}