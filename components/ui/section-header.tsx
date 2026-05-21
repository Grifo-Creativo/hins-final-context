// components/ui/section-header.tsx
import { Heading } from "@/components/ui/heading"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  /**
   * Jerarquía semántica.
   * md = h3 (card principal, títulos de contenido unitario)
   * sm = no recomendado — usar directamente <Heading level="h3"> en su lugar
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
  size = "md",
  action,
  className,
}: SectionHeaderProps) {
  const isMd = size === "md"

  // md = H3 (default, recomendado)
  // sm = pequeño, deprecated
  const headingLevel = isMd ? ("h3" as const) : ("h3" as const)

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <Heading
        level={headingLevel}
        className={isMd ? "" : "text-sm font-medium"}
      >
        {title}
      </Heading>
      {action && (
        <div className="ml-auto flex-shrink-0">{action}</div>
      )}
    </div>
  )
}
