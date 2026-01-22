export function formatISK(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""

  if (abs >= 1_000_000_000_000) {
    return `${sign}${(abs / 1_000_000_000_000).toFixed(2)}T`
  }
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K`
  }
  return `${sign}${abs.toFixed(0)}`
}

export function formatISKLong(amount: number): string {
  return `${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} ISK`
}
