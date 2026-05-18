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
  UserCheck,
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
  Users,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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

const totalSteps = 5

const TRADES_LIST = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Mason",
  "Tiler",
  "Welder",
  "Landscaper",
  "Cleaner",
  "Mechanic",
  "Locksmith",
  "HVAC Tech"
]

const EXPERIENCE_LEVELS = [
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 - 9 Years" },
  { value: "10", label: "10+ Years" }
]

const BUDGET_RANGES = [
  "Below KES 5,000",
  "KES 5,000 - 10,000",
  "KES 10,000 - 20,000",
  "KES 20,000 - 50,000",
  "Over KES 50,000"
]

const URGENCY_LEVELS = [
  "Today / Immediate",
  "Within 3 Days",
  "Within a Week",
  "Flexible / Planning"
]

const steps = [
  { id: 1, label: "Account Type" },
  { id: 2, label: "Basics" },
  { id: 3, label: "Details" },
  { id: 4, label: "Contact" },
  { id: 5, label: "Security" },
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

  // Dynamic header icon based on current step
  const StepIcon = useMemo(() => {
    if (currentStep === 1) return Users
    if (currentStep === 2) return User
    if (currentStep === 3) return userType === "fundi" ? Wrench : Briefcase
    if (currentStep === 4) return MessageSquare
    return ShieldCheck
  }, [currentStep, userType])

  const stepTitle = useMemo(() => {
    if (currentStep === 1) return "Choose Account Type"
    if (currentStep === 2) return "Welcome to FundiHub"
    if (currentStep === 3) {
      return userType === "fundi" ? "Professional Details" : "Project Details"
    }
    if (currentStep === 4) return "Preferred Contact"
    return "Security Setup"
  }, [currentStep, userType])

  const stepDescription = useMemo(() => {
    if (currentStep === 1) return "Select who you are to begin your personalized onboarding."
    if (currentStep === 2) return "Let's start with your basic profile details."
    if (currentStep === 3) {
      return userType === "fundi"
        ? "Describe your expert trade and experience level."
        : "Describe the specific service details you are looking for."
    }
    if (currentStep === 4) {
      return userType === "fundi"
        ? "How should clients reach you?"
        : "How should fundis reach you?"
    }
    return "Choose a strong password to protect your account."
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
      if (!formData.preferredContact) {
        setStepError("Please select a preferred contact method.")
        return false
      }
      return true
    }

    if (currentStep === 5) {
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

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < totalSteps) {
      goNext()
      return
    }

    if (!validateStep()) return

    setIsLoading(true)
    setStepError("")
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType,
          ...formData,
          email: `${formData.phone.replace(/[^0-9]/g, "")}@fundihub.com`,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setStepError(data.error || "An error occurred during sign up.")
      } else {
        window.location.href = "/auth/login"
      }
    } catch (error) {
      setStepError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 sm:py-12 flex flex-col justify-center items-center font-sans select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Header containing step progress, and descriptions */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stepTitle}
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {stepDescription}
            </p>
          </div>

          {/* Segmented Flat Progress Bars (using primary and muted variables) */}
          <div className="flex gap-1.5 w-full pt-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  currentStep >= s.id ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Registration Card (using standard shadcn Card borders and backgrounds) */}
        <Card className="border-border bg-card text-card-foreground shadow-lg rounded-xl overflow-hidden p-6 sm:p-8">
          <CardContent className="p-0">
            <form onSubmit={handleEmailSignup} className="space-y-5">
              
              {/* STEP 1: Account Type Selection (matching the reference styling using Shadcn theme) */}
              {currentStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div
                    onClick={() => setUserType("client")}
                    className={`group flex items-center justify-between p-4.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      userType === "client"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg transition-colors ${
                        userType === "client" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors">
                          I want to Hire
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                          Find and hire trusted expert fundis.
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      userType === "client" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {userType === "client" && <Check className="h-3 w-3 text-primary-foreground stroke-[3.5]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setUserType("fundi")}
                    className={`group flex items-center justify-between p-4.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      userType === "fundi"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg transition-colors ${
                        userType === "fundi" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
                      }`}>
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors">
                          I am a Fundi (Expert)
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                          Create a profile and find job opportunities.
                        </p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                      userType === "fundi" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {userType === "fundi" && <Check className="h-3 w-3 text-primary-foreground stroke-[3.5]" />}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Basic Information */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" /> Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. John Doe"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="e.g. +254 700 000 000"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Dynamic Category / Trade Details */}
              {currentStep === 3 && userType === "client" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label htmlFor="projectCategory" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-primary" /> Service Needed
                    </Label>
                    <select
                      id="projectCategory"
                      value={formData.projectCategory}
                      onChange={(e) => updateField("projectCategory", e.target.value)}
                      className="flex h-9.5 w-full rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select the service you need...</option>
                      {TRADES_LIST.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="projectLocation" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Project Location
                    </Label>
                    <Input
                      id="projectLocation"
                      value={formData.projectLocation}
                      onChange={(e) => updateField("projectLocation", e.target.value)}
                      placeholder="e.g. Nairobi, Kilimani"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="budgetRange" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-primary" /> Budget Range (KES)
                    </Label>
                    <select
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => updateField("budgetRange", e.target.value)}
                      className="flex h-9.5 w-full rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select a budget range...</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b} className="bg-card text-foreground">{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="urgency" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> Urgency / Timeline
                    </Label>
                    <select
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => updateField("urgency", e.target.value)}
                      className="flex h-9.5 w-full rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select urgency timeline...</option>
                      {URGENCY_LEVELS.map((u) => (
                        <option key={u} value={u} className="bg-card text-foreground">{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 3 && userType === "fundi" && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-1.5">
                    <Label htmlFor="trade" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-primary" /> Primary Skill / Trade
                    </Label>
                    <select
                      id="trade"
                      value={formData.trade}
                      onChange={(e) => updateField("trade", e.target.value)}
                      className="flex h-9.5 w-full rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select your primary trade...</option>
                      {TRADES_LIST.map((t) => (
                        <option key={t} value={t} className="bg-card text-foreground">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary" /> Experience (Years)
                    </Label>
                    <select
                      id="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={(e) => updateField("yearsExperience", e.target.value)}
                      className="flex h-9.5 w-full rounded-xl border border-input bg-card px-3.5 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled className="bg-card text-muted-foreground">Select years of experience...</option>
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <option key={exp.value} value={exp.value} className="bg-card text-foreground">{exp.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="serviceArea" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Service Area Coverage
                    </Label>
                    <Input
                      id="serviceArea"
                      value={formData.serviceArea}
                      onChange={(e) => updateField("serviceArea", e.target.value)}
                      placeholder="e.g. Nairobi, Langata"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nationalId" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-primary" /> National ID Number
                    </Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => updateField("nationalId", e.target.value)}
                      placeholder="For background safety"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Preferred Contact (Select Option Cards matching theme colors) */}
              {currentStep === 4 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div
                    onClick={() => updateField("preferredContact", "whatsapp")}
                    className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      formData.preferredContact === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg">💬</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-xs text-card-foreground group-hover:text-primary transition-colors">WhatsApp Chat</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Receive job and detail prompts instantly on WhatsApp.</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      formData.preferredContact === "whatsapp" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {formData.preferredContact === "whatsapp" && <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[4]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => updateField("preferredContact", "call")}
                    className={`group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      formData.preferredContact === "call"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg">📞</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-xs text-card-foreground group-hover:text-primary transition-colors">Direct Call</h4>
                        <p className="text-[9px] text-muted-foreground mt-0.5">Allow direct voice calls for quick communication.</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      formData.preferredContact === "call" ? "border-primary bg-primary" : "border-muted-foreground/30"
                    }`}>
                      {formData.preferredContact === "call" && <Check className="h-2.5 w-2.5 text-primary-foreground stroke-[4]" />}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Security Credentials */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-primary" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          placeholder="Min 6 characters"
                          className="pl-3.5 pr-10 w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-primary" /> Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          placeholder="Repeat password"
                          className="pl-3.5 pr-10 w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Box */}
                  <div className="flex items-start gap-2.5 pt-2 select-none w-full">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5 border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded flex-shrink-0"
                    />
                    <label
                      htmlFor="terms"
                      className="flex-1 text-xs leading-relaxed text-muted-foreground cursor-pointer font-normal block"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline font-bold">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline font-bold">
                        Privacy Policy
                      </Link>
                      .{" "}
                      {userType === "fundi"
                        ? "I understand my trade identity will be verified before matching jobs."
                        : "I understand my project and contact details will be shared with matched fundis."}
                    </label>
                  </div>
                </div>
              )}

              {/* Step Validation Error */}
              {stepError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-[11px] text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 rotate-180" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation Action Buttons (styled matching reference with standard buttons) */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground font-medium text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="w-1" />
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={goNext}
                    disabled={isLoading}
                    className="font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    Continue <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || !userType}
                    className="font-extrabold flex items-center gap-1.5 cursor-pointer"
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
          </CardContent>
        </Card>

        {/* Step X of 5 Sub-footer */}
        <div className="text-center space-y-3.5">
          <p className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
            Step {currentStep} of {totalSteps} · Secure & Encrypted
          </p>

          <div className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
