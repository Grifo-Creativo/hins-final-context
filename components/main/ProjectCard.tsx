import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { SoftBadge } from "@/components/ui/soft-badge"
import type { Project } from "@/data/main-mock"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: Project
}

/** Estilo tipo botón secundario sin elemento <button> (evita anidar interactivos dentro de <Link>). */
function AccessCta({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "flex h-9 w-full items-center justify-center rounded-md border border-input bg-background",
        "text-sm font-medium text-foreground shadow-sm",
        "group-hover/card:border-foreground/20"
      )}
    >
      {label}
    </span>
  )
}

export function ProjectCard({ project }: ProjectCardProps) {
  const canAccess = project.href !== null
  const remoteImage =
    project.coverImageUrl?.startsWith("https://hins.com.ar") ?? false

  const inner = (
    <Card
      className={cn(
        "group/card flex h-full flex-col overflow-hidden p-0 shadow-sm ring-0 transition-shadow",
        canAccess && "cursor-pointer hover:shadow-md"
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {project.coverImageUrl ? (
          remoteImage ? (
            <Image
              src={project.coverImageUrl}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImageUrl}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          )
        ) : (
          <div
            className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,#e7e5e4_0px,#e7e5e4_8px,#f5f5f4_8px,#f5f5f4_16px)]"
            aria-hidden
          />
        )}
        <div className="pointer-events-none absolute left-3 top-3 z-10">
          <SoftBadge className="bg-white/95 font-medium shadow-sm">
            {project.type === "GDC" ? "GDCV" : "GDD"}
          </SoftBadge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 pt-0 pb-6 px-6">
        <h3 className="text-base font-semibold leading-snug text-foreground m-0">
          {project.name}
        </h3>
        <div className="flex-1" />
        {canAccess ? (
          <AccessCta label="Acceder" />
        ) : (
          <span className="flex h-9 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/30 text-sm font-medium text-muted-foreground">
            Próximamente
          </span>
        )}
      </div>
    </Card>
  )

  if (canAccess && project.href) {
    return (
      <Link
        href={project.href}
        className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {inner}
      </Link>
    )
  }

  return <div className="h-full">{inner}</div>
}
