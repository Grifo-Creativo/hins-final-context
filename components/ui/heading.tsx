import { cn } from "@/lib/utils"

type HeadingLevel = "h1" | "h2" | "h3"

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Nivel semántico: h1 (vista), h2 (sección), h3 (card/lista/componente) */
  level: HeadingLevel
  /** Contenido del heading */
  children: React.ReactNode
  /** Clases Tailwind adicionales */
  className?: string
}

/**
 * Heading — Atom de jerarquía tipográfica
 *
 * Componentiza los estilos H1/H2/H3 según design-system.md
 * para garantizar consistencia en toda la aplicación.
 *
 * Uso:
 * <Heading level="h3">Desglose de Ahorro</Heading>
 * <Heading level="h3" className="custom-class">Title</Heading>
 */
export function Heading({ level, children, className, ...props }: HeadingProps) {
  const baseStyles = "text-foreground"

  const levelStyles: Record<HeadingLevel, string> = {
    h1: "text-4xl font-bold",        // H1: 36px, 700 — Título principal
    h2: "text-2xl font-semibold",    // H2: 24px, 600 — Títulos de sección (futuro)
    h3: "text-lg font-semibold",     // H3: 18px, 600 — Títulos de cards/listas (ACTUAL)
  }

  const finalClassName = cn(baseStyles, levelStyles[level], className)

  const HeadingElement = level

  return (
    <HeadingElement className={finalClassName} {...props}>
      {children}
    </HeadingElement>
  )
}
