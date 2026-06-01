// components/ui/section-header.tsx
import { Heading } from "@/components/ui/heading"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  /**
   * Jerarquía semántica del título.
   * - `h3` (default): bloques/cards — `Heading` `text-lg`
   * - `h2`: sección de vista (ej. ROI socio) — tag `h2`, misma escala visual que `h3` en bloques ROI
   */
  level?: "h2" | "h3"
  /**
   * @deprecated Usar `level`. Mantenido por compatibilidad (`size="sm"` → estilos pequeños en h3).
   */
  size?: "md" | "sm"
  /** Slot libre — TabsForBlocks, DropdownMenu, Button, Select, etc. */
  action?: React.ReactNode
  className?: string
}

/**
 * SectionHeader — Molecule: Heading (atom) + action slot
 *
 * Combina el Heading atom con un slot flexible para acciones.
 * Patrón: Heading centered + optional action (ml-auto, flex-shrink-0)
 *
 * Preferencia:
 * - Para H3 con actions: usa esta molecule
 * - Para H3 sin actions: usa directamente <Heading level="h3">
 * - size="sm" está deprecated — usa <Heading level="..."> en su lugar
 */
export function SectionHeader({
  title,
  level = "h3",
  size = "md",
  action,
  className,
}: SectionHeaderProps) {
  const isMd = size === "md"
  const titleClassName =
    level === "h2"
      ? "text-lg font-semibold text-foreground"
      : isMd
        ? undefined
        : "text-sm font-medium"

  return (
    <div
      className={cn(
        "flex flex-row gap-2 sm:gap-4 items-center justify-between",
        className
      )}
    >
      {level === "h2" ? (
        <h2 className={cn("min-w-0 text-balance", titleClassName)}>{title}</h2>
      ) : (
        <Heading level="h3" className={titleClassName}>
          {title}
        </Heading>
      )}
      {action ? (
        <div className="flex w-full shrink-0 sm:ml-auto sm:w-auto">{action}</div>
      ) : null}
    </div>
  )
}
