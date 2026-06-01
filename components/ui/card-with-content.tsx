// components/ui/card-with-content.tsx
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"

interface Tab {
  value: string
  label: string
}

interface CardWithContentProps {
  title: string
  subtitle?: string
  tabs?: Tab[]
  defaultTab?: string
  /** Tab activo controlado — sincroniza chips con el estado del chart. */
  activeTab?: string
  onTabChange?: (value: string) => void
  /** Controles extra en el header, a la derecha y después de `tabs` (ej. toggle $ / ⚡). Opcional. */
  headerActions?: React.ReactNode
  children: React.ReactNode
  className?: string
  /** When true, skips the header row and outer content padding so children control layout (e.g. edge-to-edge sections). */
  noPadding?: boolean
  /** When true, tooltips from charts may extend outside the card without being clipped. */
  allowTooltipOverflow?: boolean
}

function CardWithContentHeaderControls({
  tabs,
  activeTab,
  defaultTab,
  onTabChange,
  headerActions,
  className,
}: Pick<
  CardWithContentProps,
  "tabs" | "activeTab" | "defaultTab" | "onTabChange" | "headerActions"
> & { className?: string }) {
  if (!tabs && !headerActions) return null

  if (!headerActions) {
    return (
      <TabsForBlocks
        tabs={tabs!}
        value={activeTab}
        defaultValue={activeTab ? undefined : defaultTab}
        onValueChange={onTabChange}
        className={cn(
          "h-full flex-shrink-0 ml-auto w-auto",
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center gap-2 ml-auto w-auto",
        className
      )}
    >
      {tabs ? (
        <TabsForBlocks
          tabs={tabs}
          value={activeTab}
          defaultValue={activeTab ? undefined : defaultTab}
          onValueChange={onTabChange}
          className="flex-shrink-0"
        />
      ) : null}
      <div className="flex-shrink-0">{headerActions}</div>
    </div>
  )
}

function CardWithContentHeader({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
}: Pick<
  CardWithContentProps,
  | "title"
  | "subtitle"
  | "tabs"
  | "defaultTab"
  | "activeTab"
  | "onTabChange"
  | "headerActions"
>) {
  const hasHeaderActions = Boolean(headerActions)
  const showTitle = Boolean(title)
  const showSubtitle = Boolean(subtitle)

  return (
    <div
      className={cn(
        "flex shrink-0 flex-row p-4 pb-0 items-center justify-between gap-2 sm:gap-4"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1 order-1"
        )}
      >
        {showTitle ? (
          <Heading level="h3" className="leading-snug min-w-0 truncate">
            {title}
          </Heading>
        ) : null}
        {showSubtitle ? (
          <p className="hidden text-sm font-normal text-muted-foreground md:block">
            {subtitle}
          </p>
        ) : null}
      </div>
      <CardWithContentHeaderControls
        tabs={tabs}
        activeTab={activeTab}
        defaultTab={defaultTab}
        onTabChange={onTabChange}
        headerActions={headerActions}
        className={hasHeaderActions ? "order-2 sm:order-2" : undefined}
      />
    </div>
  )
}

export function CardWithContent({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  children,
  className,
  noPadding = false,
  allowTooltipOverflow = false,
}: CardWithContentProps) {
  const showHeader = Boolean(title || subtitle || tabs || headerActions)

  if (noPadding) {
    return (
      <Card
        className={cn(
          "bg-white py-0 shadow-xs ring-0 rounded-xl",
          allowTooltipOverflow ? "overflow-visible" : "overflow-hidden",
          className
        )}
      >
        <div className={cn("flex flex-col", allowTooltipOverflow && "overflow-visible")}>
          {showHeader ? (
            <CardWithContentHeader
              title={title}
              subtitle={subtitle}
              tabs={tabs}
              defaultTab={defaultTab}
              activeTab={activeTab}
              onTabChange={onTabChange}
              headerActions={headerActions}
            />
          ) : null}
          {children}
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "min-h-0 bg-white py-0 shadow-xs ring-0 rounded-xl",
        allowTooltipOverflow ? "overflow-visible" : "overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "flex h-full min-h-0 flex-col gap-4",
          allowTooltipOverflow && "overflow-visible"
        )}
      >
        {showHeader ? (
          <CardWithContentHeader
            title={title}
            subtitle={subtitle}
            tabs={tabs}
            defaultTab={defaultTab}
            activeTab={activeTab}
            onTabChange={onTabChange}
            headerActions={headerActions}
          />
        ) : null}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col p-4 pt-0",
            allowTooltipOverflow && "overflow-visible"
          )}
        >
          {children}
        </div>
      </div>
    </Card>
  )
}
