"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { scaleIn, staggerContainer, fadeInUp } from "@/lib/animations"
import { CornerAccents } from "./corner-accents"
import { LoginButton } from "./login-button"

type LoginCardProps = {
  className?: string
  error?: string | null
  onLogin?: () => void
  onRetry?: () => void
}

export const LoginCard = ({
  className,
  error,
  onLogin,
  onRetry,
}: LoginCardProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await onLogin?.()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className={cn("relative w-full max-w-md", className)}
    >
      <div
        className="absolute -inset-[1px] rounded-xl opacity-75"
        style={{
          background: `linear-gradient(var(--gradient-angle, 0deg), var(--eve-cyan), var(--eve-purple), var(--eve-cyan))`,
          animation: "gradient-rotate 8s linear infinite",
        }}
      />

      <div className="relative rounded-xl bg-eve-deep/90 p-8 backdrop-blur-xl">
        <CornerAccents />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <h2 className="font-display text-xl font-semibold tracking-wide text-eve-text-primary">
              Capsuleer Authentication
            </h2>
            <p className="mt-2 font-body text-sm text-eve-text-secondary">
              Sign in with your Eve Online account to access your corporation
              dashboard
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-lg border border-eve-red/30 bg-eve-red/10 p-4"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-eve-red" />
              <div className="flex-1">
                <p className="font-body text-sm text-eve-red">{error}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 flex items-center gap-2 font-body text-sm text-eve-text-secondary transition-colors hover:text-eve-text-primary"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeInUp}>
            <LoginButton
              onClick={handleLogin}
              isLoading={isLoading}
              disabled={!!error}
            />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-2 text-eve-text-muted"
          >
            <Shield className="h-4 w-4" />
            <span className="font-body text-xs">
              Secured by Eve Online SSO
            </span>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-eve-border to-transparent" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse-glow rounded-full bg-eve-green" />
                <span className="font-body text-xs text-eve-text-muted">
                  Systems Online
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-eve-border to-transparent" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
