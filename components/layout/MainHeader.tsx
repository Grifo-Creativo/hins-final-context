// components/layout/MainHeader.tsx
"use client"

import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon, SearchIcon } from "lucide-react"

export function MainHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-background">
      <div className="flex h-14 items-center justify-between gap-3 px-6">
        {/* Left — trigger + breadcrumb */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <SidebarTrigger className="-ml-0.5 shrink-0" />
          <div className="min-w-0 flex-1 [&_[data-slot=breadcrumb-list]]:flex-nowrap [&_[data-slot=breadcrumb-list]]:overflow-hidden [&_[data-slot=breadcrumb-item]]:shrink-0 [&_[data-slot=breadcrumb-page]]:truncate">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="block truncate">
                    Proyectos
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right — chrome actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* SearchButton */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Buscar"
          >
            <SearchIcon className="size-4" aria-hidden />
          </Button>

          {/* NotificationBell */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative size-8"
                aria-label="Notificaciones"
                aria-expanded={notificationsOpen}
              >
                <BellIcon className="size-4" aria-hidden />
                <span
                  className="pointer-events-none absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive"
                  aria-hidden
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
            >
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle>Notificaciones</SheetTitle>
                <SheetDescription>
                  Avisos y comunicaciones del sistema. Solo lectura.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-1 items-center justify-center p-6">
                <p className="text-sm text-muted-foreground">
                  Sin notificaciones pendientes.
                </p>
              </div>
            </SheetContent>
          </Sheet>

          {/* UserMenu */}
          <div className="hidden items-center gap-2 pl-1 sm:flex">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs font-medium">HI</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-medium leading-tight">HINS Usr</span>
              <span className="text-[11px] text-muted-foreground">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
