export const NebulaOverlay = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(0, 212, 255, 0.08) 0%, transparent 40%),
          radial-gradient(ellipse 50% 30% at 20% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 35%)
        `,
      }}
    />
  )
}
