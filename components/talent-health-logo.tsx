import { cn } from "@/lib/utils"

interface TalentHealthLogoProps {
  variant?: "full" | "icon" | "text" | "minimal"
  size?: "sm" | "md" | "lg" | "xl"
  glow?: boolean
  className?: string
}

const sizeMap = {
  sm: { icon: 32, text: "text-lg", sub: "text-[10px]" },
  md: { icon: 40, text: "text-xl", sub: "text-xs" },
  lg: { icon: 56, text: "text-3xl", sub: "text-sm" },
  xl: { icon: 72, text: "text-4xl", sub: "text-base" },
}

function LogoIcon({ size = 40, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(glow && "drop-shadow-[0_0_12px_rgba(13,91,145,0.45)]")}
      role="img"
      aria-label="Símbolo CAI de Brasil"
    >
      <defs>
        <linearGradient id="cai-logo-gradient" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1C8AC4" />
          <stop offset="1" stopColor="#0B4D83" />
        </linearGradient>
      </defs>
      <path d="M32 4 54 16.5v25L32 54 10 41.5v-25L32 4Z" fill="url(#cai-logo-gradient)" />
      <path d="M32 10 48 19v20L32 48l-16-9V19l16-9Z" stroke="#D9F2FF" strokeOpacity=".4" strokeWidth="1.5" />
      <path d="M17 32h8l3.2-6.5L33 39l3.8-8H47" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <path d="M32 18v4M32 42v4M18 24l3 1.7M43 38.3l3 1.7" stroke="#BCEBFF" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

export function TalentHealthLogo({
  variant = "full",
  size = "md",
  glow = false,
  className,
}: TalentHealthLogoProps) {
  const s = sizeMap[size]

  if (variant === "icon") {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <LogoIcon size={s.icon} glow={glow} />
      </div>
    )
  }

  if (variant === "text") {
    return (
      <div className={cn("inline-flex flex-col", className)}>
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#0878be] via-[#006666] to-[#0878be] bg-clip-text text-transparent")}>
          CAI de Brasil
        </span>
        <span className={cn(s.sub, "text-[#a3a3a3] tracking-widest uppercase font-medium")}>
          Administradora de Saúde
        </span>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <LogoIcon size={Math.round(s.icon * 0.7)} glow={glow} />
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#0878be] to-[#006666] bg-clip-text text-transparent")}>
          TH
        </span>
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <LogoIcon size={s.icon} glow={glow} />
      <div className="flex flex-col">
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#0878be] via-[#006666] to-[#0878be] bg-clip-text text-transparent leading-none")}>
          CAI de Brasil
        </span>
        <span className={cn(s.sub, "text-[#a3a3a3] tracking-widest uppercase font-medium mt-0.5")}>
          Administradora de Saúde
        </span>
      </div>
    </div>
  )
}
