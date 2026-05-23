"use client"

import { Wrench, Hammer, Zap } from "lucide-react"

export function FundiLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="relative flex items-center justify-center">
        {/* Rotating ring */}
        <div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>

        {/* Pulsing inner ring */}
        <div className="absolute h-24 w-24 animate-pulse rounded-full border-2 border-primary/30"></div>

        {/* Center icon container */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm">
          {/* Animated wrench */}
          <div className="relative">
            <Wrench className="h-10 w-10 animate-pulse text-primary" />
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">
          Loading Dashboard
        </h3>
        <p className="text-sm text-muted-foreground">
          Preparing your workspace...
        </p>

        {/* Animated dots */}
        <div className="mt-2 flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  )
}
