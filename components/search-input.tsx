"use client"

import qs from "query-string"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export const SearchInput = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // search filtering parameters
    const categoryId = searchParams.get("categoryId")
    const name = searchParams.get("name")

    const [value, setValue] = useState(name || "")
    const debounceVal = useDebounce<string>(value, 500)

    const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setValue(e.target.value)
    }

    useEffect(() => {
        const query = {
            name: debounceVal,
            categoryId: categoryId
        }

        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, {skipEmptyString: true, skipNull: true})

        router.push(url)
    }, [debounceVal, router, categoryId])

    return (
        <div className="relative">
            <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"/>
            <Input
                placeholder="Search for a chat buddy..."
                className="pl-10 bg-primary/10"
                onChange={onChange}
                value={value}
            />
        </div>
    )
}