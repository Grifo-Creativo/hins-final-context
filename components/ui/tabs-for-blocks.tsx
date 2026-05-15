// components/ui/tabs-for-blocks.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabsForBlocksProps {
  tabs: { value: string; label: string }[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function TabsForBlocks({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsForBlocksProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      className={cn("h-full w-full min-w-0 sm:w-auto", className)}
    >
      <TabsList className="h-full w-full min-w-0 justify-stretch gap-1 rounded-md bg-stone-200/75 p-1 sm:inline-flex sm:w-fit">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="
              h-full min-w-0 flex-1 rounded-md px-2 py-2 text-center text-sm font-medium
              sm:flex-initial sm:px-5 sm:py-2.5
              data-[state=active]:bg-white
              data-[state=active]:shadow-sm
              data-[state=inactive]:text-muted-foreground
            "
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
