// components/esquemas/FranjasEfectivasTable.tsx — las 3 franjas efectivas con origen de cada valor
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ORIGEN_LABEL, TIPOS_FRANJA } from "@/lib/admin-options"
import type { FranjaEfectiva, OrigenValor } from "@/lib/api/types"

const formatValor = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 6 })

function Valor({ valor, origen }: { valor: string; origen: OrigenValor }) {
  return (
    <span className="flex items-center gap-2">
      <span>{valor}</span>
      <Badge variant={origen === "PROPIO" ? "default" : "outline"}>{ORIGEN_LABEL[origen]}</Badge>
    </span>
  )
}

export function FranjasEfectivasTable({ franjas }: { franjas: FranjaEfectiva[] }) {
  const label = (tipo: string) => TIPOS_FRANJA.find((t) => t.value === tipo)?.label ?? tipo
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Franja</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Tarifa</TableHead>
          <TableHead>Energía</TableHead>
          <TableHead>Inyección</TableHead>
          <TableHead>Unidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {franjas.map((f) => (
          <TableRow key={f.tipo}>
            <TableCell className="font-medium">{label(f.tipo)}</TableCell>
            <TableCell>
              {f.horaInicio}–{f.horaFin}
            </TableCell>
            <TableCell>{f.tarifaNombre}</TableCell>
            <TableCell>
              <Valor valor={formatValor(f.valorEnergia.valor)} origen={f.valorEnergia.origen} />
            </TableCell>
            <TableCell>
              <Valor valor={formatValor(f.valorInyeccion.valor)} origen={f.valorInyeccion.origen} />
            </TableCell>
            <TableCell>
              <Valor valor={f.unidad.valor} origen={f.unidad.origen} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
