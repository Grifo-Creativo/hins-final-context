interface UltimaActualizacionProps {
  ultimoIngresoCalculadoEn: string | null | undefined
}

/** Hora de la última generación de ingresos disponible (el día en curso puede estar incompleto). */
export function UltimaActualizacion({ ultimoIngresoCalculadoEn }: UltimaActualizacionProps) {
  if (!ultimoIngresoCalculadoEn) return null
  const fecha = new Date(ultimoIngresoCalculadoEn)
  if (Number.isNaN(fecha.getTime())) return null
  const texto = fecha.toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  })
  return <p className="text-xs text-muted-foreground">Ingresos actualizados al {texto}</p>
}
