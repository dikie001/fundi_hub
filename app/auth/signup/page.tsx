"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<"client" | "fundi">("client")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }
    setIsLoading(true)
    // Simulate signup
    setTimeout(() => {
      setIsLoading(false)
      // Handle signup logic here
    }, 2000)
  }

  const handleGoogleSignup = () => {
    setIsLoading(true)
    // Handle Google OAuth
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleFacebookSignup = () => {
    setIsLoading(true)
    // Handle Facebook OAuth
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-background via-background to-primary/5 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <Badge variant="secondary" className="mb-3">
            New account
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-primary">FundiHub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Africa&apos;s trusted skilled worker platform.
          </p>
        </div>

        <Card className="border-border/70 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join FundiHub and get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={userType === "client" ? "default" : "outline"}
                  onClick={() => setUserType("client")}
                  className="h-10"
                >
                  Client
                </Button>
                <Button
                  type="button"
                  variant={userType === "fundi" ? "default" : "outline"}
                  onClick={() => setUserType("fundi")}
                  className="h-10"
                >
                  Fundi/Expert
                </Button>
              </div>
            </div>

            <form onSubmit={handleEmailSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pr-12"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pr-12"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                    disabled={isLoading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-md border border-border/70 p-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
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
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !agreedToTerms}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue with Google
              </Button>

              <Button
                onClick={handleFacebookSignup}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue with Facebook
              </Button>
            </div>

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

        <Card className="mt-6 border-border/70 bg-linear-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <h3 className="mb-3 text-sm font-semibold">Why join FundiHub?</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>• Access to verified skilled workers</li>
              <li>• Direct communication via WhatsApp and calls</li>
              <li>• Transparent pricing with no hidden fees</li>
              <li>• Community of trusted experts</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center gap-4 text-xs text-muted-foreground">
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
  )
}
