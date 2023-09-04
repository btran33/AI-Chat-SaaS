import { auth } from '@clerk/nextjs'
import prismaDB from './prismadb'

const DAY_IN_MS =  86_400_000;

export const checkSubscription = async () : Promise<boolean> => {
    const { userId } = auth()

    if (!userId) { return false }

    // fetch user subscription
    const userSubscription = await prismaDB.userSubscription.findUnique({
        where: {
            userId: userId
        },
        select: {
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
            stripeSubscriptionId: true
        }
    });

    if (!userSubscription) { return false }

    // include 1 day grace period from when subscription ended
    const isValid = userSubscription.stripePriceId && 
                    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid
}