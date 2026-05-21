"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo, useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select"

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

const TRADES_LIST: MultiSelectOption[] = [
  { value: "Plumber", label: "Plumber" },
  { value: "Electrician", label: "Electrician" },
  { value: "Carpenter", label: "Carpenter" },
  { value: "Painter", label: "Painter" },
  { value: "Mason", label: "Mason" },
  { value: "Welder", label: "Welder" },
  { value: "Appliance Repair", label: "Appliance Repair" },
  { value: "HVAC Tech", label: "HVAC Tech" },
  { value: "Cleaner", label: "Cleaner" },
  { value: "Gardener", label: "Gardener" },
]

const EXPERIENCE_LEVELS = [
  { value: "1", label: "1 Year" },
  { value: "2", label: "2 Years" },
  { value: "3", label: "3 Years" },
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 - 9 Years" },
  { value: "10", label: "10+ Years" },
]

const BUDGET_RANGES = [
  "Below KES 5,000",
  "KES 5,000 - 10,000",
  "KES 10,000 - 20,000",
  "KES 20,000 - 50,000",
  "Over KES 50,000",
]

const URGENCY_LEVELS = [
  "Today / Immediate",
  "Within 3 Days",
  "Within a Week",
  "Flexible / Planning",
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
  const [referrerId, setReferrerId] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get("ref")
      if (ref) {
        setReferrerId(ref)
      }
    }
  }, [])
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [stepError, setStepError] = useState("")
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false)
  const [otherFieldType, setOtherFieldType] = useState<
    "trade" | "projectCategory" | null
  >(null)
  const [otherInputValue, setOtherInputValue] = useState("")
  // Multi-select states (joined to comma-separated string on submit)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])
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

  // Memoized trade options containing custom inputs if they are set
  const clientTrades = useMemo(() => {
    if (
      formData.projectCategory &&
      formData.projectCategory !== "Other" &&
      !TRADES_LIST.includes(formData.projectCategory)
    ) {
      return [...TRADES_LIST, formData.projectCategory]
    }
    return TRADES_LIST
  }, [formData.projectCategory])

  const fundiTrades = useMemo(() => {
    if (
      formData.trade &&
      formData.trade !== "Other" &&
      !TRADES_LIST.includes(formData.trade)
    ) {
      return [...TRADES_LIST, formData.trade]
    }
    return TRADES_LIST
  }, [formData.trade])

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
    if (currentStep === 1)
      return "Select who you are to begin your personalized onboarding."
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

  const handleSelectProjectCategory = (val: string) => {
    if (val === "Other") {
      updateField("projectCategory", "Other")
      setOtherFieldType("projectCategory")
      setOtherInputValue("")
      setTimeout(() => {
        setIsOtherModalOpen(true)
      }, 100)
    } else {
      updateField("projectCategory", val)
    }
  }

  const handleSelectTrade = (val: string) => {
    if (val === "Other") {
      updateField("trade", "Other")
      setOtherFieldType("trade")
      setOtherInputValue("")
      setTimeout(() => {
        setIsOtherModalOpen(true)
      }, 100)
    } else {
      updateField("trade", val)
    }
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
        if (selectedTrades.length === 0) {
          setStepError("Please select at least one trade / expertise.")
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
        if (selectedCategories.length === 0) {
          setStepError("Please select at least one service needed.")
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
          // Override with multi-select values joined as comma-separated strings
          projectCategory:
            selectedCategories.join(",") || formData.projectCategory,
          trade: selectedTrades.join(",") || formData.trade,
          referrerId,
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 font-sans text-foreground select-none sm:px-6 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header containing step progress, and descriptions */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stepTitle}
            </h1>
            <p className="mx-auto max-w-xs text-xs text-muted-foreground">
              {stepDescription}
            </p>
          </div>

          {/* Segmented Flat Progress Bars (using primary and muted variables) */}
          <div className="flex w-full gap-1.5 pt-2">
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

        {/* Google quick signup â€” only shown on first step */}
        {currentStep === 1 && (
          <Card className="rounded-xl border-border bg-card p-5 text-card-foreground shadow-sm">
            <CardContent className="space-y-3 p-0">
              <p className="text-center text-xs text-muted-foreground">
                Quick sign up
              </p>
              <Button
                type="button"
                variant="outline"
                className="relative h-11 w-full cursor-pointer rounded-xl text-sm font-semibold"
                onClick={() => {
                  window.location.href = "/api/auth/google"
                }}
              >
                <svg
                  className="absolute left-4 h-5 w-5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] text-muted-foreground">
                  or sign up with phone
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Registration Card (using standard shadcn Card borders and backgrounds) */}
        <Card className="overflow-hidden rounded-xl border-border bg-card p-6 text-card-foreground shadow-lg sm:p-8">
          <CardContent className="p-0">
            <form onSubmit={handleEmailSignup} className="space-y-5">
              {/* STEP 1: Account Type Selection (matching the reference styling using Shadcn theme) */}
              {currentStep === 1 && (
                <div className="animate-in space-y-3.5 duration-300 fade-in slide-in-from-bottom-2">
                  <div
                    onClick={() => setUserType("client")}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4.5 transition-all duration-200 ${
                      userType === "client"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2.5 transition-colors ${
                          userType === "client"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        <User className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary">
                          I want to Hire
                        </h3>
                        <p className="mt-0.5 max-w-50 text-[10px] text-muted-foreground">
                          Find and hire trusted expert fundis.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                        userType === "client"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {userType === "client" && (
                        <Check className="h-3 w-3 stroke-[3.5] text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setUserType("fundi")}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4.5 transition-all duration-200 ${
                      userType === "fundi"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2.5 transition-colors ${
                          userType === "fundi"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:text-primary"
                        }`}
                      >
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary">
                          I am a Fundi (Expert)
                        </h3>
                        <p className="mt-0.5 max-w-50 text-[10px] text-muted-foreground">
                          Create a profile and find job opportunities.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                        userType === "fundi"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {userType === "fundi" && (
                        <Check className="h-3 w-3 stroke-[3.5] text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Basic Information */}
              {currentStep === 2 && (
                <div className="animate-in space-y-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="text-xs font-bold text-foreground"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="e.g. John Doe"
                        disabled={isLoading}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-bold text-foreground"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="e.g. +254 700 000 000"
                        disabled={isLoading}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Dynamic Category / Trade Details */}
              {currentStep === 3 && userType === "client" && (
                <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="projectCategory"
                      className="text-xs font-bold text-foreground"
                    >
                      Services Needed
                    </Label>
                    <MultiSelect
                      options={TRADES_LIST}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                      placeholder="Select services you need..."
                      disabled={isLoading}
                    />
                    {selectedCategories.length === 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Select at least one service.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="projectLocation"
                      className="text-xs font-bold text-foreground"
                    >
                      Project Location
                    </Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="projectLocation"
                        value={formData.projectLocation}
                        onChange={(e) =>
                          updateField("projectLocation", e.target.value)
                        }
                        placeholder="e.g. Nairobi, Kilimani"
                        disabled={isLoading}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="budgetRange"
                      className="text-xs font-bold text-foreground"
                    >
                      Budget Range (KES)
                    </Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(val) => updateField("budgetRange", val)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="budgetRange" className="w-full">
                        <SelectValue placeholder="Select a budget range..." />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_RANGES.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="urgency"
                      className="text-xs font-bold text-foreground"
                    >
                      Urgency / Timeline
                    </Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(val) => updateField("urgency", val)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="urgency" className="w-full">
                        <SelectValue placeholder="Select urgency timeline..." />
                      </SelectTrigger>
                      <SelectContent>
                        {URGENCY_LEVELS.map((u) => (
                          <SelectItem key={u} value={u}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 3 && userType === "fundi" && (
                <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="trade"
                      className="text-xs font-bold text-foreground"
                    >
                      Trades / Expertise
                    </Label>
                    <MultiSelect
                      options={TRADES_LIST}
                      value={selectedTrades}
                      onChange={setSelectedTrades}
                      placeholder="Select your trades & expertise..."
                      disabled={isLoading}
                    />
                    {selectedTrades.length === 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Select at least one trade.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="yearsExperience"
                      className="text-xs font-bold text-foreground"
                    >
                      Experience (Years)
                    </Label>
                    <Select
                      value={formData.yearsExperience}
                      onValueChange={(val) =>
                        updateField("yearsExperience", val)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger id="yearsExperience" className="w-full">
                        <SelectValue placeholder="Select years of experience..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((exp) => (
                          <SelectItem key={exp.value} value={exp.value}>
                            {exp.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="serviceArea"
                      className="text-xs font-bold text-foreground"
                    >
                      Service Area Coverage
                    </Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="serviceArea"
                        value={formData.serviceArea}
                        onChange={(e) =>
                          updateField("serviceArea", e.target.value)
                        }
                        placeholder="e.g. Nairobi, Langata"
                        disabled={isLoading}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="nationalId"
                      className="text-xs font-bold text-foreground"
                    >
                      National ID Number
                    </Label>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) =>
                          updateField("nationalId", e.target.value)
                        }
                        placeholder="For background safety"
                        disabled={isLoading}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Preferred Contact (Select Option Cards matching theme colors) */}
              {currentStep === 4 && (
                <div className="animate-in space-y-3 duration-300 fade-in slide-in-from-bottom-2">
                  <div
                    onClick={() => updateField("preferredContact", "whatsapp")}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                      formData.preferredContact === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg">ðŸ’¬</span>
                      <div className="text-left">
                        <h4 className="text-xs font-semibold text-card-foreground transition-colors group-hover:text-primary">
                          WhatsApp Chat
                        </h4>
                        <p className="mt-0.5 text-[9px] text-muted-foreground">
                          Receive job and detail prompts instantly on WhatsApp.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                        formData.preferredContact === "whatsapp"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {formData.preferredContact === "whatsapp" && (
                        <Check className="h-2.5 w-2.5 stroke-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => updateField("preferredContact", "call")}
                    className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                      formData.preferredContact === "call"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-lg">ðŸ“ž</span>
                      <div className="text-left">
                        <h4 className="text-xs font-semibold text-card-foreground transition-colors group-hover:text-primary">
                          Direct Call
                        </h4>
                        <p className="mt-0.5 text-[9px] text-muted-foreground">
                          Allow direct voice calls for quick communication.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
                        formData.preferredContact === "call"
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {formData.preferredContact === "call" && (
                        <Check className="h-2.5 w-2.5 stroke-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Security Credentials */}
              {currentStep === 5 && (
                <div className="animate-in space-y-4 duration-300 fade-in slide-in-from-bottom-2">
                  <input
                    type="text"
                    name="username"
                    value={formData.phone}
                    autoComplete="username"
                    className="sr-only"
                    tabIndex={-1}
                    readOnly
                  />
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="password"
                        className="text-xs font-bold text-foreground"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            updateField("password", e.target.value)
                          }
                          placeholder="Min 6 characters"
                          className="w-full pr-10 pl-10"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-xs font-bold text-foreground"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            updateField("confirmPassword", e.target.value)
                          }
                          placeholder="Repeat password"
                          className="w-full pr-10 pl-10"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions Box */}
                  <div className="flex w-full items-start gap-2.5 pt-2 select-none">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) =>
                        setAgreedToTerms(checked === true)
                      }
                      disabled={isLoading}
                      className="mt-0.5 shrink-0 rounded border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <label
                      htmlFor="terms"
                      className="block flex-1 cursor-pointer text-xs leading-relaxed font-normal text-muted-foreground"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-bold text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-bold text-primary hover:underline"
                      >
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
                <div className="flex animate-in items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-[11px] text-destructive duration-200 fade-in slide-in-from-top-1">
                  <ShieldCheck className="h-4 w-4 shrink-0 rotate-180" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation Action Buttons (styled matching reference with standard buttons) */}
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={isLoading}
                    className="h-9.5 cursor-pointer rounded-lg px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="w-1" />
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={isLoading}
                    className="flex h-9.5 cursor-pointer items-center gap-1.5 rounded-lg px-5 text-xs font-bold"
                  >
                    Continue{" "}
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !userType}
                    className="flex h-9.5 cursor-pointer items-center gap-1.5 rounded-lg px-6 text-xs font-extrabold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        Finish Sign Up{" "}
                        <Check className="h-3.5 w-3.5 stroke-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Step X of 5 Sub-footer */}
        <div className="space-y-3.5 text-center">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Step {currentStep} of {totalSteps}
          </p>

          <div className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-bold text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Modal Dialog for "Other..." custom trade/service entry */}
      <Dialog open={isOtherModalOpen} onOpenChange={setIsOtherModalOpen}>
        <DialogContent className="w-full max-w-sm animate-in rounded-lg border border-border bg-card p-5 shadow-lg duration-150 zoom-in-95 fade-in">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">
              {otherFieldType === "trade"
                ? "Custom Skill / Trade"
                : "Custom Service Needed"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {otherFieldType === "trade"
                ? "Enter your specific trade or skill name below."
                : "Enter the custom service type you are looking for."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              value={otherInputValue}
              onChange={(e) => setOtherInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && otherInputValue.trim()) {
                  e.preventDefault()
                  if (otherFieldType) {
                    updateField(otherFieldType, otherInputValue.trim())
                  }
                  setIsOtherModalOpen(false)
                }
              }}
              placeholder="e.g. Glass Cleaner, Solar Tech"
              className="w-full rounded-lg text-xs"
              autoFocus
            />
          </div>

          <DialogFooter className="mt-2 flex items-center justify-end gap-2 border-t border-border pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsOtherModalOpen(false)
                if (otherFieldType) {
                  updateField(otherFieldType, "")
                }
              }}
              className="h-9.5 cursor-pointer rounded-lg px-4 text-xs text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (otherInputValue.trim()) {
                  if (otherFieldType) {
                    updateField(otherFieldType, otherInputValue.trim())
                  }
                  setIsOtherModalOpen(false)
                }
              }}
              disabled={!otherInputValue.trim()}
              className="h-9.5 cursor-pointer rounded-lg px-4 text-xs font-bold"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
