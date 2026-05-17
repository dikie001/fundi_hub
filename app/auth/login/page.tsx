"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-background via-background to-primary/5 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <Badge variant="secondary" className="mb-3">
            Welcome back
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-primary">FundiHub</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue finding trusted skilled experts.
          </p>
        </div>

        <Card className="border-border/70 bg-card/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Sign in to your FundiHub account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue with Google
              </Button>

              <Button
                onClick={handleFacebookLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue with Facebook
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-center text-xs text-muted-foreground">
                Having trouble? Contact us at{" "}
                <a
                  href="mailto:calvincewise@gmail.com"
                  className="text-primary hover:underline"
                >
                  support@fundihub.com
                </a>
              </p>
            </div>
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
