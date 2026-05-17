"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">FundiHub</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary">
              Categories
            </Link>
            <Link href="/refer-earn" className="text-sm font-medium hover:text-primary">
              Refer & Earn
            </Link>
            <Link href="/for-fundis" className="text-sm font-medium hover:text-primary">
              For Fundis
            </Link>
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
          <div className="border-t border-border md:hidden">
            <div className="space-y-2 px-2 py-4">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Categories
              </Link>
              <Link
                href="/refer-earn"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Refer & Earn
              </Link>
              <Link
                href="/for-fundis"
                className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                For Fundis
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
