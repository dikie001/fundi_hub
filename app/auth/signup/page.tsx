"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const totalSteps = 3

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [pendingUserType, setPendingUserType] = useState<UserType | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(true)
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
    if (currentStep === 1) return "Account basics"
    if (currentStep === 2) {
      return userType === "fundi" ? "Professional details" : "Project details"
    }
    return "Security and confirmation"
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
      if (!formData.name || !formData.email || !formData.phone) {
        setStepError("Please fill in your full name, email, and phone number.")
        return false
      }
      return true
    }

    if (currentStep === 2) {
      if (userType === "fundi") {
        if (
          !formData.trade ||
          !formData.yearsExperience ||
          !formData.serviceArea ||
          !formData.nationalId
        ) {
          setStepError("Please complete all professional details for fundi signup.")
          return false
        }
      } else {
        if (
          !formData.projectCategory ||
          !formData.projectLocation ||
          !formData.budgetRange ||
          !formData.urgency
        ) {
          setStepError("Please complete all project details for client signup.")
          return false
        }
      }
      return true
    }

    if (!formData.password || !formData.confirmPassword) {
      setStepError("Please enter and confirm your password.")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setStepError("Passwords do not match.")
      return false
    }
    if (!agreedToTerms) {
      setStepError("You must agree to Terms and Privacy Policy to continue.")
      return false
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

  const handleRoleDialogOpenChange = (open: boolean) => {
    if (!open && !userType) return
    setIsRoleDialogOpen(open)
  }

  const confirmUserType = () => {
    if (!pendingUserType) return
    setUserType(pendingUserType)
    setCurrentStep(1)
    setStepError("")
    setIsRoleDialogOpen(false)
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
    <>
      <Dialog open={isRoleDialogOpen} onOpenChange={handleRoleDialogOpenChange}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Choose account type</DialogTitle>
            <DialogDescription>
              Start by selecting who you are. This decides the signup questions in
              the next steps.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={pendingUserType === "client" ? "default" : "outline"}
              onClick={() => setPendingUserType("client")}
              className="h-11"
            >
              Client
            </Button>
            <Button
              type="button"
              variant={pendingUserType === "fundi" ? "default" : "outline"}
              onClick={() => setPendingUserType("fundi")}
              className="h-11"
            >
              Fundi / Expert
            </Button>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingUserType(userType ?? null)}
              disabled={!userType}
            >
              Keep current
            </Button>
            <Button
              type="button"
              onClick={confirmUserType}
              disabled={!pendingUserType}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative min-h-screen bg-linear-to-br from-background via-background to-primary/10 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-sm">
          <Card className="border-border/80 bg-card/95 shadow-xl">
            <CardHeader className="space-y-2 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPendingUserType(userType)
                    setIsRoleDialogOpen(true)
                  }}
                >
                  {userType === "fundi" ? "Fundi" : "Client"}
                </Button>
              </div>
              <CardTitle className="text-3xl leading-none font-semibold tracking-tight">
                Create account
              </CardTitle>
              <CardDescription className="text-base">{stepTitle}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <form onSubmit={handleEmailSignup} className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="John Doe"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+254 700 000 000"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && userType === "client" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectCategory">Service needed</Label>
                      <Input
                        id="projectCategory"
                        value={formData.projectCategory}
                        onChange={(e) =>
                          updateField("projectCategory", e.target.value)
                        }
                        placeholder="e.g. Plumbing, Electrical"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectLocation">Project location</Label>
                      <Input
                        id="projectLocation"
                        value={formData.projectLocation}
                        onChange={(e) =>
                          updateField("projectLocation", e.target.value)
                        }
                        placeholder="City / neighborhood"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Budget range</Label>
                      <Input
                        id="budgetRange"
                        value={formData.budgetRange}
                        onChange={(e) => updateField("budgetRange", e.target.value)}
                        placeholder="e.g. KES 15,000 - 30,000"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">How soon do you need help?</Label>
                      <Input
                        id="urgency"
                        value={formData.urgency}
                        onChange={(e) => updateField("urgency", e.target.value)}
                        placeholder="Today, this week, flexible..."
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && userType === "fundi" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trade">Primary trade</Label>
                      <Input
                        id="trade"
                        value={formData.trade}
                        onChange={(e) => updateField("trade", e.target.value)}
                        placeholder="e.g. Electrician"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsExperience">Years of experience</Label>
                      <Input
                        id="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={(e) =>
                          updateField("yearsExperience", e.target.value)
                        }
                        placeholder="e.g. 6"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceArea">Service area</Label>
                      <Input
                        id="serviceArea"
                        value={formData.serviceArea}
                        onChange={(e) => updateField("serviceArea", e.target.value)}
                        placeholder="City / counties you serve"
                        disabled={isLoading}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID number</Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) => updateField("nationalId", e.target.value)}
                        placeholder="For verification"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Preferred contact</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={
                            formData.preferredContact === "whatsapp"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => updateField("preferredContact", "whatsapp")}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.preferredContact === "call"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => updateField("preferredContact", "call")}
                        >
                          Call
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.preferredContact === "email"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => updateField("preferredContact", "email")}
                        >
                          Email
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          placeholder="Create a strong password"
                          className="pr-12"
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-1/2 right-1 -translate-y-1/2"
                          disabled={isLoading}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            updateField("confirmPassword", e.target.value)
                          }
                          placeholder="Confirm your password"
                          className="pr-12"
                          disabled={isLoading}
                          required
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-1/2 right-1 -translate-y-1/2"
                          disabled={isLoading}
                          aria-label={
                            showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-md border border-border/70 p-3">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) =>
                          setAgreedToTerms(checked === true)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="terms"
                        className="text-xs leading-relaxed text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </Label>
                    </div>
                  </div>
                )}

                {stepError && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {stepError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={currentStep === 1 || isLoading}
                  >
                    Back
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={goNext} disabled={isLoading}>
                      Next step
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading || !userType}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  )}
                </div>
              </form>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-5 flex justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
