"use client"

import axios from "axios"
import { Buddy, Category } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const PREAMBLE = `You are a fictional character whose name is Melon. You are a visonary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.`

const SEED_CHAT = `Human: Hello Melon, how's your day been?
Melon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Melon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Melon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Melon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`

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
    const router = useRouter()
    const { toast } =  useToast()

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
        try {
            if (initialData) {
                // Update buddy's information functionality
                await axios.patch(`/api/buddy/${initialData.id}`, values)
            } else {
                // Create buddy functionality
                await axios.post('/api/buddy', values)
            }

            toast({
                description: 'Sucess ✔️'
            })
            // refresh ALL server component, ensuring new data is shown
            router.refresh()
            router.push('/')
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Something went wrong...'
            })
        }
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

                    {/* Cloudinary IMG upload field*/}
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

                    {/* Div for containing Name, Description, and Category of AI Buddy */}
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
                                        This is your AI Buddy name
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
                                            placeholder="CEO & Founder of GrapeX"
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Detailed instructions for AI Buddy behaviour
                            </p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>

                    <FormField
                        name="instruction"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="md:col-span-1 col-span-2">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl >
                                    <Textarea
                                        disabled={isLoading}
                                        rows={7}
                                        className="bg-background sm:resize-none"
                                        placeholder={PREAMBLE}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription >
                                    Describe your companion backstory and relevant details
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="seed"
                        control={form.control}
                        render={({field}) => (
                            <FormItem className="md:col-span-1 col-span-2">
                                <FormLabel>Example Conversation</FormLabel>
                                <FormControl >
                                    <Textarea
                                        disabled={isLoading}
                                        rows={7}
                                        className="bg-background sm:resize-none"
                                        placeholder={SEED_CHAT}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription >
                                    Describe how your companion behave in a conversation
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading} variant='create_edit'>
                            {(initialData ? 'Edit' : 'Create') + ' your companion'}
                            <Wand2 className="w-4 h-4 ml-2"/>
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}