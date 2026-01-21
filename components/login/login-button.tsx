"use client"

import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { buttonHover, buttonTap } from "@/lib/animations"

type LoginButtonProps = {
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

export const LoginButton = ({
  onClick,
  isLoading = false,
  disabled = false,
  className,
}: LoginButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={!disabled && !isLoading ? buttonHover : undefined}
      whileTap={!disabled && !isLoading ? buttonTap : undefined}
      className={cn(
        "group relative flex h-14 w-full items-center justify-center gap-3",
        "rounded-lg font-display text-base font-semibold tracking-wide",
        "bg-gradient-to-r from-eve-amber to-eve-amber-dim",
        "text-eve-void transition-all duration-200",
        "hover:shadow-[0_0_30px_rgba(255,159,28,0.4)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eve-amber focus-visible:ring-offset-2 focus-visible:ring-offset-eve-void",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="md" className="border-eve-void border-t-transparent" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          <span>Login with Eve Online</span>
        </>
      )}
    </motion.button>
  )
}
