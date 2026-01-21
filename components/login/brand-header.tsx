"use client"

import { motion } from "framer-motion"
import { EveLogo } from "@/components/shared/eve-logo"
import { fadeInDown } from "@/lib/animations"

type BrandHeaderProps = {
  tagline?: string
}

export const BrandHeader = ({
  tagline = "Corporation Command Center",
}: BrandHeaderProps) => {
  return (
    <motion.div
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="mb-8 text-center"
    >
      <EveLogo size="lg" className="mb-4" />
      <p className="font-body text-lg tracking-wide text-eve-text-secondary">
        {tagline}
      </p>
    </motion.div>
  )
}
