// components/ui/card-with-content.tsx
import { Card } from "@/components/ui/card"
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
  onTabChange?: (value: string) => void
  children: React.ReactNode
  className?: string
  /** When true, skips the header row and outer content padding so children control layout (e.g. edge-to-edge sections). */
  noPadding?: boolean
}

export function CardWithContent({
  title,
  subtitle,
  tabs,
  defaultTab,
  onTabChange,
  children,
  className,
  noPadding = false,
}: CardWithContentProps) {
  if (noPadding) {
    const showHeader = Boolean(title || subtitle || tabs)

    return (
      <Card className={cn("bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden", className)}>
        <div className="flex flex-col">
          {showHeader && (
            <div className="flex flex-col gap-4 p-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex min-w-0 w-full flex-col gap-1 sm:flex-1">
                {title ? (
                  <h3 className="text-lg font-semibold leading-snug text-foreground">
                    {title}
                  </h3>
                ) : null}
                {subtitle ? (
                  <p className="text-sm font-normal text-muted-foreground">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {tabs && (
                <TabsForBlocks
                  tabs={tabs}
                  defaultValue={defaultTab}
                  onValueChange={onTabChange}
                  className="w-full min-w-0 shrink-0 sm:ml-auto sm:w-auto"
                />
              )}
            </div>
          )}
          {children}
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-white py-0 shadow-sm ring-0 rounded-xl overflow-hidden", className)}>
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="flex shrink-0 flex-col gap-4 p-4 pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex min-w-0 w-full flex-col gap-1 sm:flex-1">
            <h3 className="text-lg font-semibold leading-snug text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-normal text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {tabs && (
            <TabsForBlocks
              tabs={tabs}
              defaultValue={defaultTab}
              onValueChange={onTabChange}
              className="w-full min-w-0 shrink-0 sm:ml-auto sm:w-auto"
            />
          )}
        </div>
        <div className="flex flex-col p-4 pt-0">{children}</div>
      </div>
    </Card>
  )
}
