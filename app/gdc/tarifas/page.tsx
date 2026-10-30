import { EsquemaTarifarioView } from "@/components/esquemas/EsquemaTarifarioView"

export default function TarifasPage(props: {
  searchParams: Promise<{ proyectoId?: string; fecha?: string; page?: string }>
}) {
  return <EsquemaTarifarioView searchParams={props.searchParams} />
}
