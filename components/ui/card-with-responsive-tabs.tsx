// components/ui/card-with-responsive-tabs.tsx
// Wrapper responsivo de CardWithContent para charts con tabs de rango
// - Desktop (≥640px): tabs en header (comportamiento original)
// - Mobile (<640px): tabs debajo del chart (optimizado para espacio)

import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { TabsForBlocks } from "@/components/ui/tabs-for-blocks"
import { cn } from "@/lib/utils"

interface Tab {
  value: string
  label: string
}

interface CardWithResponsiveTabsProps {
  title: string
  subtitle?: string
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  headerActions?: React.ReactNode
  /** Desktop (≥640px): si true, `headerActions` va antes de los chips de rango. Default: después. */
  headerActionsBeforeRangeTabs?: boolean
  children: React.ReactNode
  className?: string
  noPadding?: boolean
  allowTooltipOverflow?: boolean
  /** Contenido que se renderiza DESPUÉS de los footer tabs, solo en mobile (<640px) */
  mobileContentAfterTabs?: React.ReactNode
}

function CardWithResponsiveTabsHeader({
  title,
  subtitle,
  tabs,
  activeTab,
  defaultTab,
  onTabChange,
  headerActions,
  headerActionsBeforeRangeTabs = false,
}: Pick<
  CardWithResponsiveTabsProps,
  | "title"
  | "subtitle"
  | "tabs"
  | "activeTab"
  | "defaultTab"
  | "onTabChange"
  | "headerActions"
  | "headerActionsBeforeRangeTabs"
>) {
  const showTitle = Boolean(title)
  const showSubtitle = Boolean(subtitle)

  return (
    <div className="flex shrink-0 flex-row p-4 pb-0 items-center gap-2 sm:gap-4">
      {/* Title — siempre a la izquierda */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
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

      {/* Controls — siempre a la derecha */}
      <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
        {headerActionsBeforeRangeTabs && headerActions ? (
          <div className="hidden sm:flex flex-shrink-0">{headerActions}</div>
        ) : null}
        {/* Range tabs: solo en desktop (≥640px) */}
        <div className="hidden sm:flex">
          <TabsForBlocks
            tabs={tabs}
            value={activeTab}
            defaultValue={activeTab ? undefined : defaultTab}
            onValueChange={onTabChange}
            className="h-full flex-shrink-0"
          />
        </div>
        {/* Header actions: siempre visibles (mobile); desktop si no van antes del rango */}
        {headerActions ? (
          <div
            className={cn(
              "flex-shrink-0",
              headerActionsBeforeRangeTabs && "sm:hidden"
            )}
          >
            {headerActions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function CardWithResponsiveTabs({
  title,
  subtitle,
  tabs,
  defaultTab,
  activeTab,
  onTabChange,
  headerActions,
  headerActionsBeforeRangeTabs = false,
  children,
  className,
  noPadding = false,
  allowTooltipOverflow = false,
  mobileContentAfterTabs,
}: CardWithResponsiveTabsProps) {
  const showHeader = Boolean(title || subtitle || headerActions)

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
            <CardWithResponsiveTabsHeader
              title={title}
              subtitle={subtitle}
              tabs={tabs}
              defaultTab={defaultTab}
              activeTab={activeTab}
              onTabChange={onTabChange}
              headerActions={headerActions}
              headerActionsBeforeRangeTabs={headerActionsBeforeRangeTabs}
            />
          ) : null}
          {children}
          {/* Tabs en footer — visible solo en mobile (<640px) */}
          <div className="flex sm:hidden p-4 pt-0">
            <TabsForBlocks
              tabs={tabs}
              value={activeTab}
              defaultValue={activeTab ? undefined : defaultTab}
              onValueChange={onTabChange}
              className="w-full"
            />
          </div>
          {/* Mobile content after tabs — visible solo en mobile (<640px) */}
          {mobileContentAfterTabs ? (
            <div className="flex sm:hidden flex-col p-4 pt-0">
              {mobileContentAfterTabs}
            </div>
          ) : null}
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
          <CardWithResponsiveTabsHeader
            title={title}
            subtitle={subtitle}
            tabs={tabs}
            defaultTab={defaultTab}
            activeTab={activeTab}
            onTabChange={onTabChange}
            headerActions={headerActions}
            headerActionsBeforeRangeTabs={headerActionsBeforeRangeTabs}
          />
        ) : null}
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col p-4 pt-0",
            allowTooltipOverflow && "overflow-visible"
          )}
        >
          {children}
          {/* Tabs en footer — visible solo en mobile (<640px) */}
          <div className="flex sm:hidden pt-4">
            <TabsForBlocks
              tabs={tabs}
              value={activeTab}
              defaultValue={activeTab ? undefined : defaultTab}
              onValueChange={onTabChange}
              className="w-full"
            />
          </div>
          {/* Mobile content after tabs — visible solo en mobile (<640px) */}
          {mobileContentAfterTabs ? (
            <div className="flex sm:hidden flex-col pt-4">
              {mobileContentAfterTabs}
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
