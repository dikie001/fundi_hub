export interface Fundi {
  id: string
  name: string
  title: string
  category: string
  rating: number
  reviews: number
  image: string
  phone: string
  whatsapp: string
  verified: boolean
  premiumLevel: "none" | "verified" | "top"
  isEmergency: boolean
  isNearby: boolean
  description: string
}

export const categories = [
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

export const fundis: Fundi[] = [
  {
    id: "1",
    name: "Joseph Kariuki",
    title: "Expert Plumber",
    category: "Plumbers",
    rating: 4.9,
    reviews: 287,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joseph",
    phone: "+254712345678",
    whatsapp: "+254712345678",
    verified: true,
    premiumLevel: "top",
    isEmergency: true,
    isNearby: true,
    description: "15+ years experience in residential and commercial plumbing. 24/7 emergency services available.",
  },
  {
    id: "2",
    name: "Moses Kipchoge",
    title: "Master Electrician",
    category: "Electricians",
    rating: 4.8,
    reviews: 234,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Moses",
    phone: "+254723456789",
    whatsapp: "+254723456789",
    verified: true,
    premiumLevel: "verified",
    isEmergency: true,
    isNearby: false,
    description: "Certified electrician with expertise in wiring, installations, and troubleshooting.",
  },
  {
    id: "3",
    name: "Grace Mwangi",
    title: "Professional Carpenter",
    category: "Carpenters",
    rating: 4.7,
    reviews: 156,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Grace",
    phone: "+254734567890",
    whatsapp: "+254734567890",
    verified: true,
    premiumLevel: "none",
    isEmergency: false,
    isNearby: true,
    description: "Custom furniture and home renovation specialist. Quality craftsmanship guaranteed.",
  },
  {
    id: "4",
    name: "David Okonkwo",
    title: "Certified Welder",
    category: "Welders",
    rating: 4.6,
    reviews: 198,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    phone: "+254745678901",
    whatsapp: "+254745678901",
    verified: true,
    premiumLevel: "top",
    isEmergency: false,
    isNearby: false,
    description: "Skilled in all welding types. Industrial and domestic projects welcome.",
  },
  {
    id: "5",
    name: "Patricia Adhiambo",
    title: "Expert Painter",
    category: "Painters",
    rating: 4.5,
    reviews: 167,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia",
    phone: "+254756789012",
    whatsapp: "+254756789012",
    verified: false,
    premiumLevel: "none",
    isEmergency: false,
    isNearby: true,
    description: "Interior and exterior painting with attention to detail. Eco-friendly paints available.",
  },
  {
    id: "6",
    name: "Samuel Maina",
    title: "Auto Mechanic",
    category: "Mechanics",
    rating: 4.8,
    reviews: 312,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel",
    phone: "+254767890123",
    whatsapp: "+254767890123",
    verified: true,
    premiumLevel: "verified",
    isEmergency: true,
    isNearby: false,
    description: "Engine repairs, maintenance, and diagnostics for all vehicle types.",
  },
]
