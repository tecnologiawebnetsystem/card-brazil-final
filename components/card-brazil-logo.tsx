import { cn } from "@/lib/utils"

interface CardBrazilLogoProps {
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
      className={cn(glow && "drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]")}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="logo-accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      {/* Hexagon shape */}
      <path
        d="M32 4L56 18V46L32 60L8 46V18L32 4Z"
        fill="url(#logo-gradient)"
        stroke="#c2410c"
        strokeWidth="1.5"
      />
      {/* Inner hexagon border */}
      <path
        d="M32 10L50 21V43L32 54L14 43V21L32 10Z"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      {/* Stylized "T" for Tecnologia */}
      <path
        d="M20 24H44V29H35V46H29V29H20V24Z"
        fill="#ffffff"
      />
      {/* Connection dots - blue accent (Card Brazil concept) */}
      <circle cx="12" cy="18" r="2.5" fill="url(#logo-accent)" />
      <circle cx="52" cy="18" r="2.5" fill="url(#logo-accent)" />
      <circle cx="12" cy="46" r="2.5" fill="url(#logo-accent)" />
      <circle cx="52" cy="46" r="2.5" fill="url(#logo-accent)" />
      {/* Connection lines */}
      <line x1="14" y1="18" x2="20" y2="24" stroke="url(#logo-accent)" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="18" x2="44" y2="24" stroke="url(#logo-accent)" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

export function CardBrazilLogo({
  variant = "full",
  size = "md",
  glow = false,
  className,
}: CardBrazilLogoProps) {
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
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#dc2626] via-[#c2410c] to-[#dc2626] bg-clip-text text-transparent")}>
          CardBrazil
        </span>
        <span className={cn(s.sub, "text-[#a3a3a3] tracking-widest uppercase font-medium")}>
          Sistema de Saude
        </span>
      </div>
    )
  }

  if (variant === "minimal") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <LogoIcon size={Math.round(s.icon * 0.7)} glow={glow} />
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#dc2626] to-[#c2410c] bg-clip-text text-transparent")}>
          CB
        </span>
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <LogoIcon size={s.icon} glow={glow} />
      <div className="flex flex-col">
        <span className={cn(s.text, "font-bold tracking-tight bg-gradient-to-r from-[#dc2626] via-[#c2410c] to-[#dc2626] bg-clip-text text-transparent leading-none")}>
          CardBrazil
        </span>
        <span className={cn(s.sub, "text-[#a3a3a3] tracking-widest uppercase font-medium mt-0.5")}>
          Sistema de Saude
        </span>
      </div>
    </div>
  )
}
