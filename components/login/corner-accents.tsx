import { cn } from "@/lib/utils"

type CornerAccentsProps = {
  className?: string
}

export const CornerAccents = ({ className }: CornerAccentsProps) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-eve-cyan/40" />
      <div className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-eve-cyan/40" />
      <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-eve-cyan/40" />
      <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-eve-cyan/40" />
    </div>
  )
}
