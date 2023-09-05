import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismaDB from "@/lib/prismadb";
import { stripe } from '@/lib/stripe'
import { absoluteUrl } from "@/lib/utils";

const settingUrl = absoluteUrl('/settings');

export async function GET() {
    try {
        const { userId } = auth()
        const user = await currentUser()

        if (!user || !userId) {
            return new NextResponse('Unauthorized', { status : 401})
        }
        
        const userSubscription = await prismaDB.userSubscription.findUnique({
            where: {
                userId: userId
            }
        });
        
        // check if user have active subscription
        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingUrl
            })

            return new NextResponse(JSON.stringify({
                url: stripeSession.url
            }))
        }

        // if it is user's first time subscribing
        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingUrl,
            cancel_url: settingUrl,
            payment_method_types: ['card'],
            mode: 'subscription',
            billing_address_collection: 'auto',
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: 'USD',
                        product_data: {
                            name: 'Buddy Pro',
                            description: 'Create custom AI Buddy'
                        },
                        unit_amount: 999,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId // Stripe returns a webhook with this data
            }
        })

        return new NextResponse(JSON.stringify({
            url: stripeSession.url
        }))
    } catch (error) {
        console.log('[STRIPE_GET]', error)
        return new NextResponse('Internal error', { status : 500 })
    }
}