// components/gdd/GddNotificationsPanel.tsx
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function GddNotificationsPanel() {
  return (
    <div
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4"
      role="region"
      aria-label="Lista de notificaciones del parque"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Sin avisos por ahora
          </CardTitle>
          <CardDescription>
            Cuando existan alertas o comunicaciones del sistema para este
            parque, se listarán aquí. Esta vista es solo de lectura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay notificaciones en el período consultado.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
