// app/gdcv/performance/page.tsx
import { GdcvPageHeading } from "@/components/gdcv/GdcvPageHeading"
import { GdcvPerformanceView } from "@/components/gdcv/GdcvPerformanceView"

export default function GdcvPerformancePage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GdcvPageHeading />
      <GdcvPerformanceView />
    </div>
  )
}
