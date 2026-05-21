"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { UserMenu } from "@/components/user-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [authUser, setAuthUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isNotHome = pathname !== "/"

  useEffect(() => {
    fetch("/api/auth/me")
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
            <Link href="/#home" className="flex items-center gap-2">
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
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/#home"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/#categories"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Search
            </Link>
            <Link
              href="/#refer-earn"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Refer & Earn
            </Link>
            <Link
              href="/#for-fundis"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              For Fundis
            </Link>
            <div className="flex items-center gap-3 border-l border-border pl-8">
              {authUser ? (
                <UserMenu
                  name={authUser.name}
                  phone={authUser.phone}
                  image={
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
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="animate-in border-t border-border duration-200 fade-in slide-in-from-top-2 md:hidden">
            <div className="space-y-2 px-2 py-4">
              <Link
                href="/#home"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Home
              </Link>
              <Link
                href="/#categories"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Search
              </Link>
              <Link
                href="/#refer-earn"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Refer & Earn
              </Link>
              <Link
                href="/#for-fundis"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                For Fundis
              </Link>
              <div className="space-y-2 border-t border-border pt-2">
                {authUser ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
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
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
