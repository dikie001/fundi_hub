import { db } from "@/lib/db"
import { Fundi } from "@/lib/types"

export async function getCategories() {
  try {
    const dbCategories = await db.category.findMany({
      orderBy: { name: "asc" },
    })

    return dbCategories.map((cat) => ({
      name: cat.name,
      icon: cat.icon,
    }))
  } catch (error) {
    console.error("Error fetching categories from database:", error)
    return []
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
      const profile = user.fundiProfile! as unknown as NonNullable<
        typeof user.fundiProfile
      > & {
        isAvailable: boolean
        isNearby: boolean
      }
      return {
        id: user.id,
        name: user.name,
        title: profile.title,
        category: profile.category,
        trade: profile.trade,
        yearsExperience: profile.yearsExperience,
        rating: profile.rating,
        reviews: profile.reviews,
        image: profile.image || "",
        phone: user.phone,
        whatsapp: user.phone,
        verified: profile.premiumLevel !== "none",
        premiumLevel: profile.premiumLevel as "none" | "verified" | "top",
        isAvailable: profile.isAvailable,
        isNearby: profile.isNearby,
        description: profile.description || "",
        serviceArea: profile.serviceArea,
        skills: profile.skills,
      }
    })
  } catch (error) {
    console.error("Error fetching fundis from database:", error)
    return []
  }
}
