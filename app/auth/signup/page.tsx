"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Wrench,
  Check,
  ChevronRight,
  ChevronLeft,
  Phone,
  Mail,
  Lock,
  ShieldCheck,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UserType = "client" | "fundi"

type SignupFormData = {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  projectCategory: string
  projectLocation: string
  budgetRange: string
  urgency: string
  trade: string
  yearsExperience: string
  serviceArea: string
  nationalId: string
  preferredContact: "whatsapp" | "call" | "email"
}

const totalSteps = 4

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Basics" },
  { id: 3, label: "Details" },
  { id: 4, label: "Security" },
]

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [stepError, setStepError] = useState("")
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    projectCategory: "",
    projectLocation: "",
    budgetRange: "",
    urgency: "",
    trade: "",
    yearsExperience: "",
    serviceArea: "",
    nationalId: "",
    preferredContact: "whatsapp",
  })

  const stepTitle = useMemo(() => {
    if (currentStep === 1) return "Choose account type"
    if (currentStep === 2) return "About you"
    if (currentStep === 3) {
      return userType === "fundi" ? "Professional details" : "Project details"
    }
    return "Contact & security"
  }, [currentStep, userType])

  const stepDescription = useMemo(() => {
    if (currentStep === 1) return "Select who you are to begin the onboarding"
    if (currentStep === 2) return "Enter your basic profile details"
    if (currentStep === 3) {
      return userType === "fundi"
        ? "Describe your expert trade and experience"
        : "Describe the service details you need"
    }
    return "Setup contact method and password"
  }, [currentStep, userType])

  const updateField = <K extends keyof SignupFormData>(
    key: K,
    value: SignupFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const validateStep = () => {
    setStepError("")

    if (currentStep === 1) {
      if (!userType) {
        setStepError("Please select Client or Fundi to proceed.")
        return false
      }
      return true
    }

    if (currentStep === 2) {
      if (!formData.name.trim()) {
        setStepError("Please enter your full name.")
        return false
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setStepError("Please enter a valid email address.")
        return false
      }
      if (!formData.phone.trim()) {
        setStepError("Please enter your phone number.")
        return false
      }
      return true
    }

    if (currentStep === 3) {
      if (userType === "fundi") {
        if (!formData.trade.trim()) {
          setStepError("Please enter your primary trade.")
          return false
        }
        if (!formData.yearsExperience.trim()) {
          setStepError("Please enter your years of experience.")
          return false
        }
        if (!formData.serviceArea.trim()) {
          setStepError("Please enter the coverage areas.")
          return false
        }
        if (!formData.nationalId.trim()) {
          setStepError("Please enter your national ID.")
          return false
        }
      } else {
        if (!formData.projectCategory.trim()) {
          setStepError("Please specify the service needed.")
          return false
        }
        if (!formData.projectLocation.trim()) {
          setStepError("Please enter the project location.")
          return false
        }
        if (!formData.budgetRange.trim()) {
          setStepError("Please specify your budget range.")
          return false
        }
        if (!formData.urgency.trim()) {
          setStepError("Please specify how soon you need help.")
          return false
        }
      }
      return true
    }

    if (currentStep === 4) {
      if (!formData.password || !formData.confirmPassword) {
        setStepError("Please enter and confirm your password.")
        return false
      }
      if (formData.password.length < 6) {
        setStepError("Password must be at least 6 characters.")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setStepError("Passwords do not match.")
        return false
      }
      if (!agreedToTerms) {
        setStepError("You must agree to the Terms and Privacy Policy.")
        return false
      }
      return true
    }

    return true
  }

  const goNext = () => {
    if (!validateStep()) return
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1))
  }

  const goBack = () => {
    setStepError("")
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleStepClick = (stepId: number) => {
    if (stepId >= currentStep) return
    setStepError("")
    setCurrentStep(stepId)
  }

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < totalSteps) {
      goNext()
      return
    }

    if (!validateStep()) return

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Submit signup payload to backend here.
    }, 2000)
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-background via-background to-primary/10 px-4 py-4 sm:px-6 sm:py-8 flex flex-col justify-center items-center overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Brand logo container */}
        <div className="flex flex-col items-center mb-4">
          <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
            <Image
              src="/logo.png"
              alt="Fundi Hub Logo"
              width={36}
              height={36}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              FundiHub
            </span>
          </Link>
        </div>

        <Card className="border-border/60 bg-card/95 backdrop-blur-xs shadow-xl rounded-xl overflow-hidden transition-all duration-300">
          <CardHeader className="space-y-3 pb-4 pt-5 px-6 border-b border-border/40">
            {/* Visual Stepper */}
            <div className="select-none max-w-md mx-auto w-full">
              <div className="flex items-start justify-between relative">
                {steps.map((s, idx) => (
                  <div key={s.id} className="flex-1 last:flex-initial relative flex flex-col items-center">
                    {/* Connecting Line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 right-[-50%] h-0.5 z-0 transition-all duration-500 rounded-full ${
                          currentStep > s.id ? "bg-primary" : "bg-muted-foreground/15"
                        }`}
                      />
                    )}
                    
                    {/* Circle */}
                    <div
                      onClick={() => handleStepClick(s.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 cursor-pointer relative z-10 ${
                        currentStep > s.id
                          ? "bg-primary border-primary text-primary-foreground shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                          : currentStep === s.id
                          ? "bg-primary/10 border-primary text-primary bg-card"
                          : "bg-muted border-muted-foreground/15 text-muted-foreground bg-card"
                      }`}
                    >
                      {currentStep > s.id ? (
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      ) : (
                        s.id
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`mt-1.5 text-[10px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-250 relative z-10 ${
                        currentStep === s.id
                          ? "text-primary font-extrabold"
                          : currentStep > s.id
                          ? "text-foreground/80"
                          : "text-muted-foreground/80"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2 text-center sm:text-left">
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                {stepTitle}
              </CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">
                {stepDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              {/* STEP 1: Account Type Selection (Condensed Cards) */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div
                    onClick={() => setUserType("client")}
                    className={`group relative flex flex-col items-center text-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      userType === "client"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.01]"
                        : "border-border/80 hover:border-primary/45 hover:bg-muted/40 hover:shadow-xs"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                        userType === "client"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <User className="h-8 w-8 stroke-[1.8]" />
                    </div>
                    <h3 className="font-bold text-base mb-1 text-foreground group-hover:text-primary transition-colors">
                      I want to Hire
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Find, connect, and book skilled experts for home repairs, wiring, cleaning, and more.
                    </p>
                    {userType === "client" && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md shadow-primary/20">
                        <Check className="h-3 w-3 stroke-[4]" />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setUserType("fundi")}
                    className={`group relative flex flex-col items-center text-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      userType === "fundi"
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/5 scale-[1.01]"
                        : "border-border/80 hover:border-primary/45 hover:bg-muted/40 hover:shadow-xs"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl mb-3 transition-all duration-300 ${
                        userType === "fundi"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <Wrench className="h-8 w-8 stroke-[1.8]" />
                    </div>
                    <h3 className="font-bold text-base mb-1 text-foreground group-hover:text-primary transition-colors">
                      I am a Fundi (Expert)
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Create your expert trade profile, showcase your services, get booked for local jobs, and earn.
                    </p>
                    {userType === "fundi" && (
                      <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md shadow-primary/20">
                        <Check className="h-3 w-3 stroke-[4]" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Basic Information (Efficient Layout) */}
              {currentStep === 2 && (
                <div className="space-y-3.5 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground/80" /> Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Jane Doe"
                        disabled={isLoading}
                        required
                        className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground/80" /> Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+254 700 000 000"
                        disabled={isLoading}
                        required
                        className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground/80" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="jane@example.com"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Dynamic Category / Trade Details (Perfect 2x2 Grid) */}
              {currentStep === 3 && userType === "client" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label htmlFor="projectCategory" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground/80" /> Service Needed
                    </Label>
                    <Input
                      id="projectCategory"
                      value={formData.projectCategory}
                      onChange={(e) => updateField("projectCategory", e.target.value)}
                      placeholder="e.g. Plumbing, Wiring, Painting"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="projectLocation" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" /> Project Location
                    </Label>
                    <Input
                      id="projectLocation"
                      value={formData.projectLocation}
                      onChange={(e) => updateField("projectLocation", e.target.value)}
                      placeholder="City or neighborhood"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="budgetRange" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground/80" /> Budget Range (KES)
                    </Label>
                    <Input
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => updateField("budgetRange", e.target.value)}
                      placeholder="e.g. KES 15,000 - 30,000"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="urgency" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" /> How soon do you need help?
                    </Label>
                    <Input
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => updateField("urgency", e.target.value)}
                      placeholder="e.g. Today, This Week, Flexible"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && userType === "fundi" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label htmlFor="trade" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-muted-foreground/80" /> Primary Skill / Trade
                    </Label>
                    <Input
                      id="trade"
                      value={formData.trade}
                      onChange={(e) => updateField("trade", e.target.value)}
                      placeholder="e.g. Electrician, Carpenter"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-muted-foreground/80" /> Years of Experience
                    </Label>
                    <Input
                      id="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={(e) => updateField("yearsExperience", e.target.value)}
                      placeholder="e.g. 5"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="serviceArea" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/80" /> Service Area Coverage
                    </Label>
                    <Input
                      id="serviceArea"
                      value={formData.serviceArea}
                      onChange={(e) => updateField("serviceArea", e.target.value)}
                      placeholder="Counties or towns served"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nationalId" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground/80" /> National ID Number
                    </Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => updateField("nationalId", e.target.value)}
                      placeholder="For background safety"
                      disabled={isLoading}
                      required
                      className="h-10 px-3 border-border/80 focus-visible:ring-primary rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Contact & Security (Horizontal + Slim Design) */}
              {currentStep === 4 && (
                <div className="space-y-3.5 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      Preferred Communication
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "whatsapp")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "whatsapp"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/25 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-base select-none">💬</span>
                        <span className="text-xs font-bold">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "call")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "call"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/25 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-base select-none">📞</span>
                        <span className="text-xs font-bold">Call</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "email")}
                        className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "email"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/25 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-base select-none">✉️</span>
                        <span className="text-xs font-bold">Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/80" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          placeholder="Min 6 characters"
                          className="h-10 pl-3 pr-9 border-border/80 focus-visible:ring-primary rounded-lg text-xs w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/80" /> Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          placeholder="Repeat password"
                          className="h-10 pl-3 pr-9 border-border/80 focus-visible:ring-primary rounded-lg text-xs w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 px-3 rounded-lg bg-muted/20 border border-border/30 transition-all duration-300">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5 border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-[10px] leading-relaxed text-muted-foreground select-none cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline font-bold">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline font-bold">
                        Privacy Policy
                      </Link>
                      . I understand my data is verified for onboarding and job matches.
                    </Label>
                  </div>
                </div>
              )}

              {/* Step Validation Error */}
              {stepError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 rotate-180" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 1 || isLoading}
                  className="h-10 px-4 border-border hover:bg-muted/40 rounded-lg font-bold flex items-center gap-1 transition-all text-xs cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5 stroke-[2.5]" /> Back
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={isLoading}
                    className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shadow-primary/10 rounded-lg font-bold flex items-center gap-1 transition-all text-xs cursor-pointer"
                  >
                    Next Step <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !userType}
                    className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/15 rounded-lg font-extrabold flex items-center gap-1 transition-all text-xs cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        Finish Sign Up <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="text-center text-xs pt-1 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer legal links */}
        <div className="mt-4 flex justify-center gap-4 text-[10px] text-muted-foreground/80">
          <Link href="/privacy" className="hover:text-primary transition-colors font-semibold">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors font-semibold">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-primary transition-colors font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
