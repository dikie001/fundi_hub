"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { SafeUser } from "@/lib/types"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [authUser, setAuthUser] = useState<SafeUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isNotHome = pathname !== "/"

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setAuthUser(d.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setAuthUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/fundi_hub_logo.jpg"
                alt="FundiHub"
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div className="text-2xl font-bold text-primary">FundiHub</div>
            </Link>
            {isNotHome && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-8 w-8 cursor-pointer rounded-full border border-border/50 text-muted-foreground hover:bg-accent hover:text-foreground md:flex"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Categories
            </Link>
            <Link
              href="/for-fundis"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              For Fundis
            </Link>
            <Link
              href="/refer-earn"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Refer & Earn
            </Link>
            <div className="flex items-center gap-3 border-l border-border pl-8">
              {authUser ? (
                <UserMenu
                  name={authUser.name}
                  phone={authUser.phone}
                  image={
                    authUser.image ||
                    authUser.fundiProfile?.image ||
                    authUser.clientProfile?.image
                  }
                  role={authUser.role}
                  onLogout={handleLogout}
                />
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[86vw] max-w-xs p-0">
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle className="text-base font-semibold">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-1 px-4 py-4">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Home
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Browse Categories
                </Link>
                <Link
                  href="/for-fundis"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  For Fundis
                </Link>
                <Link
                  href="/refer-earn"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Refer & Earn
                </Link>
                
                <div className="my-2 border-t border-border"></div>
                
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  Terms of Service
                </Link>

                <div className="space-y-2 border-t border-border pt-3">
                  {authUser ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        await handleLogout()
                        setIsOpen(false)
                      }}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link
                          href="/auth/login"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign In
                        </Link>
                      </Button>
                      <Button size="sm" asChild className="w-full">
                        <Link
                          href="/auth/signup"
                          onClick={() => setIsOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
