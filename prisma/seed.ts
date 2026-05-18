import { PrismaClient } from "@prisma/client"
import { categories, fundis } from "../lib/data"

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up database...")
  await prisma.referral.deleteMany()
  await prisma.fundiProfile.deleteMany()
  await prisma.clientProfile.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  console.log("Seeding categories...")
  for (const cat of categories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        icon: cat.icon,
      },
    })
  }
  console.log(`Seeded ${categories.length} categories.`)

  console.log("Seeding fundis...")
  for (const fundi of fundis) {
    const email = `${fundi.name.toLowerCase().replace(/\s+/g, ".")}@example.com`
    
    // Create User with role 'fundi'
    const user = await prisma.user.create({
      data: {
        name: fundi.name,
        email,
        phone: fundi.phone,
        password: "password123", // Default plaintext for seeding
        role: "fundi",
        fundiProfile: {
          create: {
            title: fundi.title,
            category: fundi.category,
            rating: fundi.rating,
            reviews: fundi.reviews,
            image: fundi.image,
            trade: fundi.category,
            yearsExperience: "5", // Default
            serviceArea: "Nairobi", // Default
            nationalId: "12345678", // Default
            preferredContact: "whatsapp",
            premiumLevel: fundi.premiumLevel,
            isEmergency: fundi.isEmergency,
            isNearby: fundi.isNearby,
            description: fundi.description,
          },
        },
      },
    })
    console.log(`Seeded fundi user: ${user.name} (${email})`)
  }

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
