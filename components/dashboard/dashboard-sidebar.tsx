"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, BookOpen, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/doctrines", label: "Doctrines", icon: BookOpen },
  { href: "/dashboard/fleets", label: "Fleets", icon: Users },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
}

export const DashboardSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] lg:block",
        "transition-all duration-300 ease-out",
        isExpanded ? "w-60" : "w-[72px]"
      )}
    >
      <div className="relative h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-eve-deep/95 to-eve-void/95 backdrop-blur-xl" />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3QgZmlsdGVyPSJ1cmwoI2EpIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+PC9zdmc+')]" />

        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-eve-cyan/20 via-eve-cyan/40 to-eve-cyan/20" />

        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-eve-cyan/40" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-eve-cyan/40" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-eve-cyan/40" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-eve-cyan/40" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-scan-line" />
        </div>

        <div className="relative h-full flex flex-col">
          <div className="px-4 py-4 border-b border-eve-border/50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute inset-0 rounded bg-eve-cyan/10 border border-eve-cyan/30" />
                <span className="font-display text-xs text-eve-cyan tracking-wider">NAV</span>
              </div>
              <span
                className={cn(
                  "font-display text-[10px] tracking-[0.2em] text-eve-text-muted uppercase",
                  "transition-opacity duration-200",
                  isExpanded ? "opacity-100" : "opacity-0"
                )}
              >
                Navigation
              </span>
            </motion.div>
          </div>

          <nav className="flex-1 py-4">
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1 px-3"
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <motion.li key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5",
                        "transition-all duration-200",
                        isActive
                          ? "bg-eve-cyan/10 text-eve-cyan"
                          : "text-eve-text-secondary hover:bg-eve-cyan/5 hover:text-eve-text-primary"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-full",
                          "transition-all duration-200",
                          isActive
                            ? "h-6 bg-eve-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                            : "group-hover:h-4 group-hover:bg-eve-cyan/50"
                        )}
                      />

                      <div className="relative">
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-all duration-200",
                            isActive && "drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
                          )}
                        />
                        {isActive && (
                          <motion.div
                            layoutId="activeIconGlow"
                            className="absolute inset-0 -m-1 rounded bg-eve-cyan/20 blur-md"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>

                      <span
                        className={cn(
                          "font-body text-sm whitespace-nowrap",
                          "transition-all duration-200",
                          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                          isActive && "text-glow-cyan font-medium"
                        )}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <motion.div
                          className="absolute right-2 h-1.5 w-1.5 rounded-full bg-eve-cyan"
                          animate={{
                            opacity: [1, 0.4, 1],
                            scale: [1, 0.8, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                )
              })}
            </motion.ul>
          </nav>

          <div className="px-4 py-4 border-t border-eve-border/50">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-eve-green" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-eve-green animate-ping opacity-75" />
              </div>
              <span
                className={cn(
                  "font-body text-xs text-eve-text-muted",
                  "transition-opacity duration-200",
                  isExpanded ? "opacity-100" : "opacity-0"
                )}
              >
                Systems Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
