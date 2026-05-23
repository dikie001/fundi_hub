"use client"

import { Shield, Crown, Sparkles } from "lucide-react"

export function AdminLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-purple-500/5">
      <div className="relative flex items-center justify-center">
        {/* Rotating ring */}
        <div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-500"></div>
        
        {/* Pulsing inner ring */}
        <div className="absolute h-24 w-24 animate-pulse rounded-full border-2 border-purple-500/30"></div>
        
        {/* Center icon container */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10 backdrop-blur-sm">
          {/* Animated shield icon */}
          <div className="relative">
            <Shield className="h-10 w-10 animate-pulse text-purple-500" />
            <Crown className="absolute -right-1 -top-1 h-4 w-4 animate-bounce text-amber-500" />
          </div>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">
          Admin Dashboard
        </h3>
        <p className="text-sm text-muted-foreground">
          Loading control panel...
        </p>
        
        {/* Animated dots */}
        <div className="mt-2 flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:0ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:150ms]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  )
}
