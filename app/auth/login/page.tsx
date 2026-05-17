"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
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

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      // Handle login logic here
    }, 2000)
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
    <div className="relative min-h-screen bg-linear-to-br from-background via-background to-primary/10 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-sm">
        <Card className="border-border/80 bg-card/95 shadow-xl">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-3xl leading-none font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to find trusted experts near you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-2.5">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Google
              </Button>

              <Button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Facebook
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs font-medium uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-1 w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm">
              New to FundiHub?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline"
              >
                Create an account
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
  )
}
