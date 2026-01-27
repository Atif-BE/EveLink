const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export type RateLimitResult = {
  limited: boolean
  remaining: number
  resetIn: number
}

export const rateLimit = (
  key: string,
  limit = 100,
  windowMs = 60_000
): RateLimitResult => {
  const now = Date.now()
  const entry = rateLimitMap.get(key) ?? { count: 0, resetTime: now + windowMs }

  if (now > entry.resetTime) {
    entry.count = 0
    entry.resetTime = now + windowMs
  }

  entry.count++
  rateLimitMap.set(key, entry)

  return {
    limited: entry.count > limit,
    remaining: Math.max(0, limit - entry.count),
    resetIn: Math.max(0, entry.resetTime - now),
  }
}

export const getRateLimitHeaders = (result: RateLimitResult, limit: number) => ({
  "X-RateLimit-Limit": limit.toString(),
  "X-RateLimit-Remaining": result.remaining.toString(),
  "X-RateLimit-Reset": Math.ceil(result.resetIn / 1000).toString(),
})
