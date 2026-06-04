// data/legal-information-placeholder.ts
// Contenido temporal — reemplazar por copy legal / PDF / CMS cuando el cliente lo defina.

export const LEGAL_DISCLAIMER_FOOTER_TEXT =
  "Los datos energéticos y monetarios mostrados en esta plataforma pueden estar sujetos a ajustes, validaciones o actualizaciones provenientes de fuentes externas. Para más información leer los"

export const LEGAL_TERMS_LINK_LABEL = "Términos y condiciones del servicio"

export const LEGAL_TERMS_DIALOG_TITLE = "Términos y condiciones del servicio"

/** [CONTENIDO TEMPORAL] — no es texto jurídico definitivo. */
export const LEGAL_TERMS_PLACEHOLDER_SECTIONS = [
  {
    heading: "[CONTENIDO TEMPORAL] Alcance del servicio",
    body: "HINS es una plataforma de visibilidad que presenta información referencial sobre generación, asignación y métricas asociadas a parques fotovoltaicos. No ejecuta acciones sobre la red eléctrica ni sustituye sistemas de facturación, medición oficial u operación del parque.",
  },
  {
    heading: "[CONTENIDO TEMPORAL] Datos y fuentes",
    body: "Los valores mostrados pueden depender de integraciones con medidores, distribuidoras, liquidaciones u otras fuentes externas. Pueden existir desfasajes, reprocesos o diferencias respecto de documentos oficiales. El usuario debe contrastar la información con sus registros contractuales y operativos cuando tome decisiones.",
  },
  {
    heading: "[CONTENIDO TEMPORAL] Metodología",
    body: "Indicadores, proyecciones y montos en moneda local o dólar se calculan según reglas de negocio y parámetros vigentes al momento de la consulta. Las proyecciones no constituyen promesa de resultado. La metodología definitiva será publicada por el área legal y de producto.",
  },
  {
    heading: "[CONTENIDO TEMPORAL] Privacidad",
    body: "El tratamiento de datos personales y de acceso por rol se regirá por la política de privacidad que el titular del servicio publique para esta plataforma. Este texto es un marcador de posición hasta disponer del documento final.",
  },
] as const
