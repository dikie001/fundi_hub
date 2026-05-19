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
        window.location.href = "/"
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Handle Google OAuth
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleFacebookLogin = () => {
    setIsLoading(true)
    // Handle Facebook OAuth
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
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
            
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-10 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border border-border bg-transparent hover:bg-muted/30"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>

              <Button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-10 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border border-border bg-transparent hover:bg-muted/30"
              >
                <svg className="h-4 w-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] tracking-wider font-semibold uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

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
