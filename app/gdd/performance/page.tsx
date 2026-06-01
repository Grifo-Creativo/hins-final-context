// app/gdd/performance/page.tsx
import { GddPageHeading } from "@/components/gdd/GddPageHeading"
import { GddPerformanceView } from "@/components/gdd/GddPerformanceView"

export default function GddPerformancePage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GddPageHeading />
      <GddPerformanceView />
    </div>
  )
}
