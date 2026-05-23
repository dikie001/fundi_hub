"use client"

import { Search, Sparkles, Zap } from "lucide-react"

export function ClientLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-background via-background to-blue-500/5">
      <div className="relative flex items-center justify-center">
        {/* Rotating ring */}
        <div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"></div>

        {/* Pulsing inner ring */}
        <div className="absolute h-24 w-24 animate-pulse rounded-full border-2 border-blue-500/30"></div>

        {/* Center icon container */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10 backdrop-blur-sm">
          {/* Animated search icon */}
          <div className="relative">
            <Search className="h-10 w-10 animate-pulse text-blue-500" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 animate-bounce text-blue-400" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">
          Loading Dashboard
        </h3>
        <p className="text-sm text-muted-foreground">
          Finding the best fundis for you...
        </p>

        {/* Animated dots */}
        <div className="mt-2 flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:0ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  )
}
