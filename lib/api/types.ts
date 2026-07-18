// Tipos 1:1 con contracts/openapi.json — ver specs/001-api-integration-remove-mocks/data-model.md

export type UsuarioRole = "HINS_ADMIN" | "GDD_OWNER" | "AGC" | "SOCIO"
export type ModeloNegocio = "GDD" | "GDC" | "GDCV"
export type TipoCargo = "CON_POTENCIA" | "SIN_POTENCIA"
export type ModeloSincronizado = "ESTACIONES" | "DISPOSITIVOS" | "ENERGIA" | "ALARMAS"
export type EstadoAlarma = "ACTIVA" | "LIMPIA"
export type EstadoEjecucionSincronizacion = "EN_CURSO" | "EXITOSO" | "FALLIDO"

export interface ErrorResponse {
  statusCode: number
  message: string
}

export interface RegisterDto {
  email: string
  nombre: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  role: UsuarioRole
  activo: boolean
}

export interface UsuarioMe {
  id: string
  email: string
  nombre: string
  role: UsuarioRole
}

export interface UpdateUsuarioDto {
  nombre?: string
  role?: UsuarioRole
  activo?: boolean
}

export interface CreateProyectoDto {
  nombre: string
  modelo: ModeloNegocio
  ubicacion: string
}

export interface Proyecto {
  id: string
  nombre: string
  modelo: ModeloNegocio
  ubicacion: string
  fechaAlta: string
  activo: boolean
}

export interface CreateParqueDto {
  proyectoId: string
  potenciaTotalKwp: number
  fechaPuestaEnMarcha: string
}

export interface Parque {
  id: string
  proyectoId: string
  potenciaTotalKwp: number
  fechaPuestaEnMarcha: string
  stationExternalId: string | null
  nombreExterno: string | null
  direccion: string | null
  longitud: number | null
  latitud: number | null
  contactoNombre: string | null
  contactoInfo: string | null
}

export interface CreateSocioDto {
  parqueId: string
  nombre: string
  participacionPorcentaje: number
  tipoCargo: TipoCargo
  medidorNumero: string
}

export interface Socio {
  id: string
  parqueId: string
  nombre: string
  participacionPorcentaje: number
  tipoCargo: TipoCargo
  medidorNumero: string
  usuarioId: string | null
}

export interface Dispositivo {
  id: string
  parqueId: string
  externalDeviceId: string
  serialNumber: string | null
  nombre: string | null
  tipoId: number
  modelo: string | null
  softwareVersion: string | null
  datosMonitoreo: Record<string, unknown> | null
  ultimaSincronizacion: string | null
}

export interface Alarma {
  id: string
  parqueId: string
  dispositivoId: string | null
  externalAlarmId: number
  esnCodeExterno: string | null
  nombre: string
  causa: string | null
  causaId: number | null
  tipo: number
  severidad: number
  fechaGenerada: string
  estado: EstadoAlarma
  fechaLimpiada: string | null
  ultimaSincronizacion: string
}

export interface RegistrarEnergiaDto {
  periodo: string
  energiaInyectadaKwh?: number
  energiaGeneradaKwh?: number
  creditoGenerado?: number
  ahorroEpec?: number
}

export interface RegistroEnergia {
  id: string
  parqueId: string
  periodo: string
  energiaInyectadaKwh: number | null
  energiaGeneradaKwh: number | null
  creditoGenerado: number | null
  ahorroEpec: number | null
}

/**
 * Forma real de lectura de GET /parques/{parqueId}/energia — distinta de
 * RegistroEnergia (que refleja el DTO de escritura/swagger). Ver
 * specs/002-park-energy-chart/research.md Decision 1/2.
 */
export interface RegistroEnergiaMensual {
  periodo: string
  energiaMesKwh: number | null
  ingresoMes: number | null
}

/**
 * Forma real de lectura de GET /parques/{parqueId}/energia?periodo=YYYY-MM —
 * granularidad diaria dentro de un mes. Ver
 * specs/003-monthly-generation-kpi/research.md Decision 1.
 */
export interface RegistroEnergiaDiario {
  fecha: string
  energiaDiaKwh: number | null
  ingresoDia: number | null
}

export interface RegistrarRoiDto {
  socioId?: string
  periodo: string
  inversionMeta: number
  creditoAcumulado: number
  paybackEstimadoMeses?: number
  tir?: number
}

export interface RegistroRoi {
  id: string
  parqueId: string
  socioId: string | null
  periodo: string
  inversionMeta: number
  creditoAcumulado: number
  paybackEstimadoMeses: number | null
  tir: number | null
}

export interface RegistrarMantenimientoDto {
  periodo: string
  cantidadMantenciones: number
  costosAsociados: number
  detalle?: string
}

export interface RegistroMantenimiento {
  id: string
  parqueId: string
  periodo: string
  cantidadMantenciones: number
  costosAsociados: number
  detalle: string | null
}

export interface UltimaEjecucionDto {
  inicio: string
  fin: string | null
  estado: EstadoEjecucionSincronizacion
  registrosProcesados: number
  registrosOmitidos: number
}

export interface ConfiguracionSincronizacionDto {
  modelo: ModeloSincronizado
  intervaloMs: number
  habilitado: boolean
  ultimaEjecucion: UltimaEjecucionDto
}

export interface ActualizarConfiguracionSincronizacionDto {
  intervaloMs?: number
  habilitado?: boolean
}

export interface RegistroEjecucionSincronizacionDto {
  inicio: string
  fin: string | null
  estado: EstadoEjecucionSincronizacion
  registrosProcesados: number
  registrosOmitidos: number
  mensajeError: string | null
}
