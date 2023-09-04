/*
    A script to seed default categories of buddies
    to chat with, through prisma connected to MySQL
    db on PlanetScale
*/

const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: 'Famous People'}, 
                { name: 'Movies & TVs'}, 
                { name: 'Musicians'}, 
                { name: 'Games'}, 
                { name: 'Animals'}, 
                { name: 'Philosophy'}, 
                { name: 'Scientists'}, 
            ]
        })
    } catch (err) {
        console.error('Error seeding default categories: ', err)
    } finally {
        await db.$disconnect()
    }
}

main()