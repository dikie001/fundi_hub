"use client"

import Link from "next/link"
import { useMemo, useState, useEffect } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Wrench,
  Check,
  ChevronRight,
  Phone,
  Lock,
  ShieldCheck,
  Briefcase,
  MapPin,
  DollarSign,
  CreditCard,
  Users,
  MessageSquare,
  Zap,
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
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select"

type UserType = "client" | "fundi"

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

const TOTAL_STEPS = 5

const STEP_LABELS = [
  "Who are you?",
  "What do you need?",
  "More details",
  "Contact",
  "Account",
]

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [referrerId, setReferrerId] = useState("")
  const [userType, setUserType] = useState<UserType | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [stepError, setStepError] = useState("")

  // Multi-select
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])

  // Form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [projectLocation, setProjectLocation] = useState("")
  const [budgetRange, setBudgetRange] = useState("")
  const [urgency, setUrgency] = useState("")
  const [serviceArea, setServiceArea] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [preferredContact, setPreferredContact] = useState<
    "whatsapp" | "call" | "email"
  >("whatsapp")
  const [checkingSession, setCheckingSession] = useState(true)
  const [isGoogleSignup, setIsGoogleSignup] = useState(false)
  const [googleData, setGoogleData] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get("ref")
      const google = params.get("google")
      if (ref) setReferrerId(ref)
      if (google === "true") {
        setIsGoogleSignup(true)
        // Fetch Google temp data from server
        fetch("/api/auth/google-temp")
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d?.name) {
              setGoogleData(d)
              setName(d.name)
            }
          })
          .catch(() => {})
      }
    }
  }, [])

  // Auto-redirect if already authenticated
  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled) return
        const role = d?.user?.role
        if (role === "fundi") {
          window.location.replace("/fundi/dashboard")
        } else if (role === "client") {
          window.location.replace("/client/dashboard")
        } else if (role === "admin") {
          window.location.replace("/admin/dashboard")
        } else {
          setCheckingSession(false)
        }
      })
      .catch(() => {
        if (!cancelled) setCheckingSession(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stepTitle = useMemo(() => {
    const titles: Record<number, string> = {
      1: "Choose Account Type",
      2: userType === "fundi" ? "Your Trades & Coverage" : "What do you need?",
      3:
        userType === "fundi"
          ? "Experience & Verification"
          : "Budget & Timeline",
      4: "Preferred Contact",
      5: "Create Your Account",
    }
    return titles[currentStep] ?? ""
  }, [currentStep, userType])

  const stepDesc = useMemo(() => {
    const descs: Record<number, string> = {
      1: "Select who you are to begin your personalised onboarding.",
      2:
        userType === "fundi"
          ? "Select your trades and the areas you cover."
          : "Tell us what service you need and where.",
      3:
        userType === "fundi"
          ? "How long have you been working and your ID for verification."
          : "Set your budget range and urgency so we can match you faster.",
      4:
        userType === "fundi"
          ? "How should clients reach you?"
          : "How should your matched fundi contact you?",
      5: "Last step! Sign up with Google for instant access or fill in your details.",
    }
    return descs[currentStep] ?? ""
  }, [currentStep, userType])

  const buildGoogleState = () => {
    const state: Record<string, string> = {
      userType: userType ?? "client",
      preferredContact,
    }
    if (userType === "client") {
      state.projectCategory = selectedCategories.join(",")
      state.projectLocation = projectLocation
      state.budgetRange = budgetRange
      state.urgency = urgency
    } else {
      state.trade = selectedTrades.join(",")
      state.serviceArea = serviceArea
      state.yearsExperience = yearsExperience
      state.nationalId = nationalId
    }
    if (referrerId) state.referrerId = referrerId
    return encodeURIComponent(JSON.stringify(state))
  }

  const handleGoogleSignup = () => {
    const stateParam = buildGoogleState()
    window.location.href = `/api/auth/google?state=${stateParam}`
  }

  const validate = (): boolean => {
    setStepError("")
    if (currentStep === 1) {
      if (!userType) {
        setStepError("Please select Client or Fundi to proceed.")
        return false
      }
    }
    if (currentStep === 2) {
      if (userType === "fundi") {
        if (selectedTrades.length === 0) {
          setStepError("Select at least one trade.")
          return false
        }
        if (!serviceArea.trim()) {
          setStepError("Enter your service coverage area.")
          return false
        }
      } else {
        if (selectedCategories.length === 0) {
          setStepError("Select at least one service.")
          return false
        }
        if (!projectLocation.trim()) {
          setStepError("Enter the project location.")
          return false
        }
      }
    }
    if (currentStep === 3) {
      if (userType === "fundi") {
        if (!yearsExperience) {
          setStepError("Select your years of experience.")
          return false
        }
        if (!nationalId.trim()) {
          setStepError("Enter your National ID.")
          return false
        }
      } else {
        if (!budgetRange) {
          setStepError("Select your budget range.")
          return false
        }
        if (!urgency) {
          setStepError("Select when you need the service.")
          return false
        }
      }
    }
    if (currentStep === 4) {
      if (!preferredContact) {
        setStepError("Select a preferred contact method.")
        return false
      }
    }
    if (currentStep === 5) {
      if (!name.trim()) {
        setStepError("Enter your full name.")
        return false
      }
      if (!phone.trim()) {
        setStepError("Enter your phone number.")
        return false
      }
      if (!isGoogleSignup) {
        if (!password || password.length < 6) {
          setStepError("Password must be at least 6 characters.")
          return false
        }
        if (password !== confirmPassword) {
          setStepError("Passwords do not match.")
          return false
        }
      }
      if (!agreedToTerms) {
        setStepError("You must agree to the Terms and Privacy Policy.")
        return false
      }
    }
    return true
  }

  const goNext = () => {
    if (validate()) setCurrentStep((p) => Math.min(TOTAL_STEPS, p + 1))
  }
  const goBack = () => {
    setStepError("")
    setCurrentStep((p) => Math.max(1, p - 1))
  }

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep < TOTAL_STEPS) {
      goNext()
      return
    }
    if (!validate()) return

    setIsLoading(true)
    setStepError("")
    try {
      const body: Record<string, string> = {
        userType: userType ?? "client",
        name,
        phone,
        password: isGoogleSignup ? crypto.randomUUID() : password,
        preferredContact,
        email: isGoogleSignup ? (googleData?.email || `${phone}@fundihub.com`) : `${phone.replace(/[^0-9]/g, "")}@fundihub.com`,
      }
      if (isGoogleSignup && googleData) {
        body.googlePicture = googleData.picture || ""
        body.googleSub = googleData.sub || ""
      }
      if (referrerId) body.referrerId = referrerId
      if (userType === "client") {
        body.projectCategory = selectedCategories.join(",")
        body.projectLocation = projectLocation
        body.budgetRange = budgetRange
        body.urgency = urgency
      } else {
        body.trade = selectedTrades.join(",")
        body.serviceArea = serviceArea
        body.yearsExperience = yearsExperience
        body.nationalId = nationalId
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setStepError(data.error || "An error occurred. Please try again.")
      } else {
        window.location.href = "/auth/login"
      }
    } catch {
      setStepError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 font-sans text-foreground select-none sm:px-6 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stepTitle}
            </h1>
            <p className="mx-auto max-w-xs text-xs text-muted-foreground">
              {stepDesc}
            </p>
          </div>
          <div className="flex w-full gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  currentStep >= i + 1 ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Card */}
        <Card className="overflow-hidden rounded-xl border-border bg-card p-6 text-card-foreground shadow-lg sm:p-8">
          <CardContent className="p-0">
            <form onSubmit={handlePhoneSignup} className="space-y-5">
              {/* ── STEP 1: Account Type ── */}
              {currentStep === 1 && (
                <div className="animate-in space-y-3.5 duration-300 fade-in slide-in-from-bottom-2">
                  {[
                    {
                      type: "client" as UserType,
                      icon: User,
                      title: "I want to Hire",
                      desc: "Find and hire trusted expert fundis.",
                    },
                    {
                      type: "fundi" as UserType,
                      icon: Wrench,
                      title: "I am a Fundi (Expert)",
                      desc: "Create a profile and find job opportunities.",
                    },
                  ].map(({ type, icon: Icon, title, desc }) => (
                    <div
                      key={type}
                      onClick={() => setUserType(type)}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${
                        userType === type
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-lg p-2.5 transition-colors ${userType === type ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-card-foreground group-hover:text-primary">
                            {title}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${userType === type ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                      >
                        {userType === type && (
                          <Check className="h-3 w-3 stroke-[3.5] text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── STEP 2: Trade/Service + Location ── */}
              {currentStep === 2 && userType === "client" && (
                <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Services Needed</Label>
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
                    <Label htmlFor="loc" className="text-xs font-bold">
                      Project Location
                    </Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="loc"
                        value={projectLocation}
                        onChange={(e) => setProjectLocation(e.target.value)}
                        placeholder="e.g. Nairobi, Kilimani"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && userType === "fundi" && (
                <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      Trades & Expertise
                    </Label>
                    <MultiSelect
                      options={TRADES_LIST}
                      value={selectedTrades}
                      onChange={setSelectedTrades}
                      placeholder="Select your trades..."
                      disabled={isLoading}
                    />
                    {selectedTrades.length === 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        Select at least one trade.
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="area" className="text-xs font-bold">
                      Service Coverage Area
                    </Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="area"
                        value={serviceArea}
                        onChange={(e) => setServiceArea(e.target.value)}
                        placeholder="e.g. Nairobi, Langata"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Budget/Urgency or Experience/ID ── */}
              {currentStep === 3 && userType === "client" && (
                <div className="flex animate-in flex-col gap-4 duration-300 fade-in slide-in-from-bottom-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">
                      Budget Range (KES)
                    </Label>
                    <Select
                      value={budgetRange}
                      onValueChange={setBudgetRange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
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
                    <Label className="text-xs font-bold">
                      Urgency / Timeline
                    </Label>
                    <Select
                      value={urgency}
                      onValueChange={setUrgency}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this?" />
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
                    <Label className="text-xs font-bold">
                      Years of Experience
                    </Label>
                    <Select
                      value={yearsExperience}
                      onValueChange={setYearsExperience}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level..." />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((e) => (
                          <SelectItem key={e.value} value={e.value}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nid" className="text-xs font-bold">
                      National ID Number
                    </Label>
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="nid"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        placeholder="For background verification"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Preferred Contact ── */}
              {currentStep === 4 && (
                <div className="animate-in space-y-3 duration-300 fade-in slide-in-from-bottom-2">
                  {[
                    {
                      value: "whatsapp" as const,
                      emoji: "💬",
                      title: "WhatsApp Chat",
                      desc: "Receive instant messages on WhatsApp.",
                    },
                    {
                      value: "call" as const,
                      emoji: "📞",
                      title: "Direct Call",
                      desc: "Allow direct voice calls for quick communication.",
                    },
                  ].map(({ value, emoji, title, desc }) => (
                    <div
                      key={value}
                      onClick={() => setPreferredContact(value)}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200 ${preferredContact === value ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-lg">{emoji}</span>
                        <div className="text-left">
                          <h4 className="text-xs font-semibold text-card-foreground group-hover:text-primary">
                            {title}
                          </h4>
                          <p className="mt-0.5 text-[9px] text-muted-foreground">
                            {desc}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${preferredContact === value ? "border-primary bg-primary" : "border-muted-foreground/30"}`}
                      >
                        {preferredContact === value && (
                          <Check className="h-2.5 w-2.5 stroke-[3.5] text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── STEP 5: Account creation — Google OR phone+password ── */}
              {currentStep === 5 && (
                <div className="animate-in space-y-5 duration-300 fade-in slide-in-from-bottom-2">
                  {/* Google option */}
                  <Button
                    type="button"
                    variant="outline"
                    className="relative h-11 w-full cursor-pointer rounded-xl text-sm font-semibold"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
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
                    Sign up with Google
                  </Button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[11px] text-muted-foreground">
                      or create an account with phone
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Phone form */}
                  <input
                    type="text"
                    name="username"
                    value={phone}
                    autoComplete="username"
                    className="sr-only"
                    tabIndex={-1}
                    readOnly
                  />

                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +254 700 000 000"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="pr-10 pl-10"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                      className="text-xs font-bold"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="pr-10 pl-10"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex w-full items-start gap-2.5 pt-1 select-none">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(c) => setAgreedToTerms(c === true)}
                      disabled={isLoading}
                      className="mt-0.5 shrink-0 rounded border-input data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                    />
                    <label
                      htmlFor="terms"
                      className="flex-1 cursor-pointer text-xs leading-relaxed text-muted-foreground"
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
                        ? "My trade identity will be verified before matching jobs."
                        : "My project details will be shared with matched fundis."}
                    </label>
                  </div>
                </div>
              )}

              {/* Error */}
              {stepError && (
                <div className="flex animate-in items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3.5 py-2 text-[11px] text-destructive duration-200 fade-in slide-in-from-top-1">
                  <ShieldCheck className="h-4 w-4 shrink-0 rotate-180" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={isLoading}
                    className="h-9 cursor-pointer rounded-lg px-4 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </Button>
                ) : (
                  <div className="w-1" />
                )}

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={isLoading}
                    className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-5 text-xs font-bold"
                  >
                    Continue{" "}
                    <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !userType}
                    className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-6 text-xs font-extrabold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" /> Finish
                        Sign Up
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-2 text-center">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Step {currentStep} of {TOTAL_STEPS}
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
    </div>
  )
}
