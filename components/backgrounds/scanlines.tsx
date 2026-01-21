export const Scanlines = () => {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-10"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(3, 4, 8, 0.4) 100%)`,
        }}
      />
    </>
  )
}
