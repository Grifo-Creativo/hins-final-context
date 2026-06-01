// app/gdcv/roi/page.tsx
import { GdcvPageHeading } from "@/components/gdcv/GdcvPageHeading"
import { GdcvRoiView } from "@/components/gdcv/GdcvRoiView"

export default function GdcvRoiPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GdcvPageHeading />
      <GdcvRoiView />
    </div>
  )
}
