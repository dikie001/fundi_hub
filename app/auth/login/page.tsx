"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Loader2, Phone, Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"

const GOOGLE_ERRORS: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_token: "Failed to authenticate with Google. Please try again.",
  google_no_email: "No email address returned from Google.",
  google_error: "An error occurred during Google sign-in.",
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()

  const googleError = searchParams.get("error")
    ? GOOGLE_ERRORS[searchParams.get("error")!] ?? "Google sign-in failed."
    : null
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

            {/* Google sign-in */}
            <Button
              type="button"
              variant="outline"
              className="relative w-full h-11 cursor-pointer rounded-xl font-semibold text-sm"
              onClick={() => { window.location.href = "/api/auth/google" }}
            >
              <svg className="absolute left-4 h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            {googleError && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {googleError}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] text-muted-foreground">or sign in with phone</span>
              <div className="h-px flex-1 bg-border" />
            </div>

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
