"use client"

import { useEffect, useState } from "react"
import { CldUploadButton } from "next-cloudinary"
import Image from 'next/image'

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
                onUpload={(result: any) => onChange(result.info.secure_url)}
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