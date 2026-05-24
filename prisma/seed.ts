import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  { name: "Plumbers", icon: "Wrench" },
  { name: "Electricians", icon: "Zap" },
  { name: "Welders", icon: "Flame" },
  { name: "Carpenters", icon: "Hammer" },
  { name: "Painters", icon: "Paintbrush" },
  { name: "Mechanics", icon: "Wrench" },
  { name: "CCTV Installers", icon: "Camera" },
  { name: "Solar Technicians", icon: "Sun" },
  { name: "Cleaners", icon: "Sparkles" },
  { name: "Appliance Repair", icon: "Zap" },
  { name: "Movers", icon: "Truck" },
  { name: "WiFi Installers", icon: "Wifi" },
]

const fundis = [
  {
    name: "Joseph Kariuki",
    title: "Expert Plumber",
    category: "Plumbers",
    rating: 4.9,
    reviews: 287,
    image: "",
    phone: "+254712345678",
    isPremium: true,
    isAvailable: true,
    isNearby: true,
    description:
      "15+ years experience in residential and commercial plumbing. 24/7 emergency services available.",
    serviceArea: "Nairobi",
    skills: "clogged drain, leak repair, piping, drainage installation",
  },
  {
    name: "Moses Kipchoge",
    title: "Master Electrician",
    category: "Electricians",
    rating: 4.8,
    reviews: 234,
    image: "",
    phone: "+254723456789",
    isPremium: true,
    isAvailable: true,
    isNearby: false,
    description:
      "Certified electrician with expertise in wiring, installations, and troubleshooting.",
    serviceArea: "Mombasa",
    skills: "house wiring, electrical testing, power failure troubleshooting",
  },
  {
    name: "Grace Mwangi",
    title: "Professional Carpenter",
    category: "Carpenters",
    rating: 4.7,
    reviews: 156,
    image: "",
    phone: "+254734567890",
    isPremium: false,
    isAvailable: false,
    isNearby: true,
    description:
      "Custom furniture and home renovation specialist. Quality craftsmanship guaranteed.",
    serviceArea: "Kisumu",
    skills: "furniture repair, custom cabinets, woodworking, door installation",
  },
  {
    name: "David Okonkwo",
    title: "Certified Welder",
    category: "Welders",
    rating: 4.6,
    reviews: 198,
    image: "",
    phone: "+254745678901",
    isPremium: true,
    isAvailable: false,
    isNearby: false,
    description:
      "Skilled in all welding types. Industrial and domestic projects welcome.",
    serviceArea: "Eldoret",
    skills: "metal welding, gate repair, steel fabrication, structural welding",
  },
  {
    name: "Patricia Adhiambo",
    title: "Expert Painter",
    category: "Painters",
    rating: 4.5,
    reviews: 167,
    image: "",
    phone: "+254756789012",
    isPremium: false,
    isAvailable: false,
    isNearby: true,
    description:
      "Interior and exterior painting with attention to detail. Eco-friendly paints available.",
    serviceArea: "Nairobi",
    skills: "wall painting, house design, wall spray painting, wallpapering",
  },
  {
    name: "Samuel Maina",
    title: "Auto Mechanic",
    category: "Mechanics",
    rating: 4.8,
    reviews: 312,
    image: "",
    phone: "+254767890123",
    isPremium: true,
    isAvailable: true,
    isNearby: false,
    description:
      "Engine repairs, maintenance, and diagnostics for all vehicle types.",
    serviceArea: "Nakuru",
    skills: "engine repair, car diagnostics, brake pad change, oil replacement",
  },
]

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
            yearsExperience: "5",
            serviceArea: fundi.serviceArea,
            nationalId: "12345678",
            preferredContact: "whatsapp",
            isPremium: fundi.isPremium,
            isAvailable: fundi.isAvailable,
            isNearby: fundi.isNearby,
            isRegistrationPaid: true,
            description: fundi.description,
            skills: fundi.skills,
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
