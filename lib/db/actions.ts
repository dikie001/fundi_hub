import { db } from "@/lib/db"
import { Fundi, categories as mockCategories } from "@/lib/data"

export async function getCategories() {
  try {
    const dbCategories = await db.category.findMany({
      orderBy: { name: "asc" },
    })

    if (dbCategories.length === 0) {
      return mockCategories
    }

    return dbCategories.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
    }))
  } catch (error) {
    console.error(
      "Error fetching categories from database, falling back to mock:",
      error
    )
    return mockCategories
  }
}

export async function getFundis(): Promise<Fundi[]> {
  try {
    const dbFundis = await db.user.findMany({
      where: {
        role: "fundi",
        fundiProfile: { isNot: null },
      },
      include: {
        fundiProfile: true,
      },
    })

    return dbFundis.map((user) => {
      const profile = user.fundiProfile!
      return {
        id: user.id,
        name: user.name,
        title: profile.title,
        category: profile.category,
        rating: profile.rating,
        reviews: profile.reviews,
        image: profile.image || "",
        phone: user.phone,
        whatsapp: user.phone, // using user.phone for communication contact
        verified: profile.premiumLevel !== "none",
        premiumLevel: profile.premiumLevel as "none" | "verified" | "top",
        isEmergency: profile.isEmergency,
        isNearby: profile.isNearby,
        description: profile.description || "",
      }
    })
  } catch (error) {
    console.error("Error fetching fundis from database:", error)
    return []
  }
}
