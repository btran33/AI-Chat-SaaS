"use client"

import { Buddy, Category } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/image-upload"
import { Input } from "@/components/ui/input"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"

interface BuddyFormProps{
    initialData: Buddy | null,
    category: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Name is required.'
    }),
    description: z.string().min(1, {
        message: 'Description is required.'
    }),
    instruction: z.string().min(200, {
        message: 'Instruction required at least 200 characters.'
    }),
    seed: z.string().min(200, {
        message: 'Seed required at least 200 characters.'
    }),
    src: z.string().min(1, {
        message: 'Image is required.'
    }),
    categoryId: z.string().min(1, {
        message: 'Category is required.'
    })
})

export const BuddyForm = ({
    initialData, category
}: BuddyFormProps) => {
    // form controller
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            description: '',
            instruction: '',
            seed: '',
            src: '',
            categoryId: undefined
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                      className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                General information
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                General information about your buddy
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>

                    <FormField 
                        name="src"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        disable={isLoading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        
                        <FormField
                            name="name"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="md:col-span-1 col-span-2">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl >
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Melon Musk"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription >
                                        This is your AI Buddy's name
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({field}) => (
                                <FormItem className="md:col-span-1 col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl >
                                        <Input
                                            disabled={isLoading}
                                            placeholder="Melon Musk"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription >
                                        A short description of your AI Buddy
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a category'
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {category.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select a category for your Buddy
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    )
}