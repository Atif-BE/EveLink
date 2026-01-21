"use client"

import { useEffect, useRef, useCallback } from "react"

type Star = {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
  depth: number
}

export const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>(0)
  const reducedMotionRef = useRef(false)

  const createStars = useCallback((width: number, height: number) => {
    const stars: Star[] = []
    const starCount = Math.floor((width * height) / 6000)

    for (let i = 0; i < Math.max(150, starCount); i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        depth: Math.random() * 3 + 1,
      })
    }

    return stars
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      starsRef.current = createStars(canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    let time = 0

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star) => {
        let opacity = star.opacity

        if (!reducedMotionRef.current) {
          opacity =
            star.opacity *
            (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset))
        }

        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * star.depth
        )

        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        gradient.addColorStop(0.3, `rgba(200, 220, 255, ${opacity * 0.6})`)
        gradient.addColorStop(1, "rgba(200, 220, 255, 0)")

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * star.depth, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      time += 1

      if (!reducedMotionRef.current) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createStars])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
