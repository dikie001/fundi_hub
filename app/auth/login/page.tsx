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
        } else if (userRole === "admin") {
          window.location.href = "/admin/dashboard"
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 font-sans text-foreground select-none sm:py-24">
      <div className="w-full max-w-md space-y-6">
        {/* Header containing title and subtitle matching signup */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mx-auto max-w-xs text-xs text-muted-foreground">
              Sign in to find trusted experts near you.
            </p>
          </div>
        </div>

        {/* Dynamic Card */}
        <Card className="overflow-hidden rounded-xl border-border bg-card p-8 text-card-foreground shadow-lg sm:p-10">
          <CardContent className="space-y-5 p-0">
            {/* Login Credentials Form */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
              {loginError && (
                <div className="flex animate-in items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive duration-200 fade-in slide-in-from-top-1">
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-foreground"
                >
                  Phone number
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="e.g. +254 700 000 000"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-bold text-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-[11px] text-muted-foreground transition-colors hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground/45" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer text-muted-foreground hover:bg-transparent hover:text-foreground"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/95"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs font-medium text-muted-foreground">
              New to FundiHub?{" "}
              <Link
                href="/auth/signup"
                className="ml-0.5 font-bold text-primary hover:underline"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer legal links matching layout */}
        <div className="flex justify-center gap-4 text-[10px] font-medium tracking-wide text-muted-foreground/80">
          <Link
            href="/privacy"
            className="cursor-pointer transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="cursor-pointer transition-colors hover:text-primary"
          >
            Terms of Service
          </Link>
          <span>•</span>
          <Link
            href="/"
            className="cursor-pointer transition-colors hover:text-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
