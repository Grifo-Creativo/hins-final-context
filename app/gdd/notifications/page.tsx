// app/gdd/notifications/page.tsx
import { redirect } from "next/navigation"

/** Ruta histórica: las notificaciones viven en Sheet (ux-guidelines §3). */
export default function GddNotificationsPage() {
  redirect("/gdd/performance")
}
