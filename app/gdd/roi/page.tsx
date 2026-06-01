// app/gdd/roi/page.tsx
import { GddPageHeading } from "@/components/gdd/GddPageHeading"
import { GddRoiView } from "@/components/gdd/GddRoiView"

export default function GddRoiPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <GddPageHeading />
      <GddRoiView />
    </div>
  )
}
