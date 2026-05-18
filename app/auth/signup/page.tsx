"use client"

import Link from "next/link"
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
  { id: 1, label: "Account Type" },
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
    if (currentStep === 1) return "Choose your account type"
    if (currentStep === 2) return "Tell us about yourself"
    if (currentStep === 3) {
      return userType === "fundi" ? "Professional details" : "Project details"
    }
    return "Preference and password"
  }, [currentStep, userType])

  const stepDescription = useMemo(() => {
    if (currentStep === 1) return "Select who you are to begin the onboarding process"
    if (currentStep === 2) return "Enter your basic profile information to register"
    if (currentStep === 3) {
      return userType === "fundi"
        ? "Describe your expert trade and experience to receive job offers"
        : "Describe the service details to find the best matching Fundis"
    }
    return "Choose contact methods and create a strong security password"
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
        setStepError("Please select whether you are a Client or a Fundi to proceed.")
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
          setStepError("Please enter the counties or service areas you serve.")
          return false
        }
        if (!formData.nationalId.trim()) {
          setStepError("Please enter your national ID number.")
          return false
        }
      } else {
        if (!formData.projectCategory.trim()) {
          setStepError("Please specify the service you need.")
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
        setStepError("Password must be at least 6 characters long.")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setStepError("Passwords do not match.")
        return false
      }
      if (!agreedToTerms) {
        setStepError("You must agree to the Terms of Service and Privacy Policy.")
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
    if (stepId >= currentStep) {
      // Don't allow clicking forward without validation
      return
    }
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
    <div className="relative min-h-screen bg-linear-to-br from-background via-background to-primary/10 px-4 py-8 sm:px-6 sm:py-12 flex flex-col justify-center items-center">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Brand Logo / Home link */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
            <img
              src="/logo.png"
              alt="Fundi Hub Logo"
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback in case logo.png doesn't exist yet
                e.currentTarget.style.display = "none"
              }}
            />
            <span className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              FundiHub
            </span>
          </Link>
        </div>

        <Card className="border-border/80 bg-card/95 backdrop-blur-xs shadow-2xl rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="space-y-4 pb-6 pt-8 border-b border-border/40">
            {/* Visual Stepper */}
            <div className="select-none">
              <div className="flex items-center justify-between">
                {steps.map((s, idx) => (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => handleStepClick(s.id)}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-all duration-300 ${
                          currentStep > s.id
                            ? "bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary),0.35)]"
                            : currentStep === s.id
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted border-muted-foreground/20 text-muted-foreground"
                        }`}
                      >
                        {currentStep > s.id ? (
                          <Check className="h-4 w-4 stroke-[3.5]" />
                        ) : (
                          s.id
                        )}
                      </div>
                      <span
                        className={`mt-2 text-[11px] font-semibold uppercase tracking-wider hidden sm:block transition-colors duration-200 ${
                          currentStep === s.id
                            ? "text-primary font-bold"
                            : currentStep > s.id
                            ? "text-foreground/80 group-hover:text-primary"
                            : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-3 -mt-4 sm:-mt-6 transition-all duration-500 rounded-full ${
                          currentStep > s.id ? "bg-primary" : "bg-muted-foreground/15"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-4">
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                {stepTitle}
              </CardTitle>
              <CardDescription className="text-sm font-medium text-muted-foreground">
                {stepDescription}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6">
            <form onSubmit={handleEmailSignup} className="space-y-6">
              {/* STEP 1: Account Type Selection */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div
                    onClick={() => setUserType("client")}
                    className={`group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      userType === "client"
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]"
                        : "border-border/80 hover:border-primary/45 hover:bg-muted/40 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                        userType === "client"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <User className="h-10 w-10 stroke-[1.8]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                      I want to Hire
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Find, connect, and hire vetted experts for electrical work, plumbing, cleaning, repairs, and other projects.
                    </p>
                    {userType === "client" && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1 shadow-md shadow-primary/20">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setUserType("fundi")}
                    className={`group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      userType === "fundi"
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]"
                        : "border-border/80 hover:border-primary/45 hover:bg-muted/40 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                        userType === "fundi"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      }`}
                    >
                      <Wrench className="h-10 w-10 stroke-[1.8]" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                      I am an Expert (Fundi)
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Create your expert profile, display your professional trades/skills, receive job requests, and grow your business.
                    </p>
                    {userType === "fundi" && (
                      <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1 shadow-md shadow-primary/20">
                        <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Basic Information */}
              {currentStep === 2 && (
                <div className="space-y-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="e.g. Jane Doe"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        disabled={isLoading}
                        required
                        className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="e.g. +254 700 000 000"
                        disabled={isLoading}
                        required
                        className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Dynamic Category / Trade Details */}
              {currentStep === 3 && userType === "client" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="projectCategory" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Service Needed
                    </Label>
                    <Input
                      id="projectCategory"
                      value={formData.projectCategory}
                      onChange={(e) => updateField("projectCategory", e.target.value)}
                      placeholder="e.g. Plumbing, Wiring, Painting"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectLocation" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Project Location
                    </Label>
                    <Input
                      id="projectLocation"
                      value={formData.projectLocation}
                      onChange={(e) => updateField("projectLocation", e.target.value)}
                      placeholder="e.g. Nairobi, Westlands"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetRange" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Estimated Budget (KES)
                    </Label>
                    <Input
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => updateField("budgetRange", e.target.value)}
                      placeholder="e.g. KES 15,000 - 30,000"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> How soon do you need it?
                    </Label>
                    <Input
                      id="urgency"
                      value={formData.urgency}
                      onChange={(e) => updateField("urgency", e.target.value)}
                      placeholder="e.g. Today, This Week, Flexible"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && userType === "fundi" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="trade" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-muted-foreground" /> Primary Trade / Skill
                    </Label>
                    <Input
                      id="trade"
                      value={formData.trade}
                      onChange={(e) => updateField("trade", e.target.value)}
                      placeholder="e.g. Electrician, Carpenter"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-muted-foreground" /> Years of Experience
                    </Label>
                    <Input
                      id="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={(e) => updateField("yearsExperience", e.target.value)}
                      placeholder="e.g. 5"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceArea" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Service / Coverage Area
                    </Label>
                    <Input
                      id="serviceArea"
                      value={formData.serviceArea}
                      onChange={(e) => updateField("serviceArea", e.target.value)}
                      placeholder="e.g. Nairobi, Kiambu, Machakos"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationalId" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" /> National ID Number
                    </Label>
                    <Input
                      id="nationalId"
                      value={formData.nationalId}
                      onChange={(e) => updateField("nationalId", e.target.value)}
                      placeholder="For account verification"
                      disabled={isLoading}
                      required
                      className="h-11 px-4 border-border/80 focus-visible:ring-primary rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Security and Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-5 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      Preferred Communication Method
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "whatsapp")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "whatsapp"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/30 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-xl mb-1 select-none">💬</span>
                        <span className="text-xs font-semibold">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "call")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "call"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/30 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-xl mb-1 select-none">📞</span>
                        <span className="text-xs font-semibold">Call</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("preferredContact", "email")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                          formData.preferredContact === "email"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/80 hover:border-primary/30 hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <span className="text-xl mb-1 select-none">✉️</span>
                        <span className="text-xs font-semibold">Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          placeholder="Create strong password"
                          className="h-11 pl-4 pr-12 border-border/80 focus-visible:ring-primary rounded-xl text-sm w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          placeholder="Confirm your password"
                          className="h-11 pl-4 pr-12 border-border/80 focus-visible:ring-primary rounded-xl text-sm w-full"
                          disabled={isLoading}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                          disabled={isLoading}
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

                  <div className="flex items-start gap-3 rounded-xl border border-border/70 p-4 bg-muted/20 transition-all duration-300">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      disabled={isLoading}
                      className="mt-0.5 border-muted-foreground/35 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-xs leading-relaxed text-muted-foreground select-none cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline font-semibold">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                      . I understand that my details will be used for onboarding and matching purposes.
                    </Label>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {stepError && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs sm:text-sm text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 rotate-180" />
                  <span>{stepError}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 1 || isLoading}
                  className="h-11 px-5 border-border hover:bg-muted/50 rounded-xl font-semibold flex items-center gap-1.5 transition-all text-sm"
                >
                  <ChevronLeft className="h-4 w-4 stroke-[2.5]" /> Back
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={isLoading}
                    className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl font-semibold flex items-center gap-1.5 transition-all text-sm cursor-pointer"
                  >
                    Next Step <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !userType}
                    className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/15 rounded-xl font-bold flex items-center gap-1.5 transition-all text-sm cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account <Check className="h-4 w-4 stroke-[3]" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="text-center text-sm pt-2 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Outer links footer */}
        <div className="mt-6 flex justify-center gap-5 text-xs text-muted-foreground/80">
          <Link href="/privacy" className="hover:text-primary transition-colors font-medium">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors font-medium">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-primary transition-colors font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
