"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2, Phone, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        setLoginError(data.error || "Invalid phone number or password.")
      } else {
        const userRole = data.user?.role
        if (userRole === "fundi") {
          window.location.href = "/fundi/dashboard"
        } else if (userRole === "client") {
          window.location.href = "/client/dashboard"
        } else {
          window.location.href = "/"
        }
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 sm:py-12 flex flex-col justify-center items-center font-sans select-none">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Header containing title and subtitle matching signup */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Sign in to find trusted experts near you.
            </p>
          </div>
        </div>

        {/* Dynamic Card */}
        <Card className="border-border bg-card text-card-foreground shadow-lg rounded-xl overflow-hidden p-6 sm:p-8">
          <CardContent className="p-0 space-y-5">

            {/* Login Credentials Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {loginError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <span>{loginError}</span>
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" /> Phone number
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="e.g. +254 700 000 000"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-primary" /> Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-transparent dark:bg-input/30 focus-visible:ring-1 focus-visible:ring-primary"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-bold h-10 text-xs rounded-lg cursor-pointer mt-2 bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-200 shadow-sm flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground font-medium pt-2">
              New to FundiHub?{" "}
              <Link
                href="/auth/signup"
                className="font-bold text-primary hover:underline ml-0.5"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer legal links matching layout */}
        <div className="flex justify-center gap-4 text-[10px] text-muted-foreground/80 font-medium tracking-wide">
          <Link href="/privacy" className="hover:text-primary transition-colors cursor-pointer">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-primary transition-colors cursor-pointer">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-primary transition-colors cursor-pointer">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
