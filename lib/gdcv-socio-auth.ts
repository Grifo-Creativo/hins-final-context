// lib/gdcv-socio-auth.ts
import { sociosMock } from "@/data/gdcv-mock"

/** Socio demo v1 — flujo completo del prototipo (Agro Sur Industrial). */
export const GDCV_SOCIO_DEMO_ID = "AS"

const STORAGE_KEY = "hins:gdcv-socio-verified"

export interface SocioVerifiedSession {
  socioId: string
  verifiedAt: number
}

export function getDemoSocio() {
  return sociosMock.find((s) => s.id === GDCV_SOCIO_DEMO_ID) ?? null
}

export function getSocioShareUrl(origin: string): string {
  return `${origin}/gdcv/socio/acceso?socio=${GDCV_SOCIO_DEMO_ID}`
}

export function getMedidorSuffix(medidor: string): string {
  return medidor.replace(/\D/g, "").slice(-4)
}

export function validateSocioOtp(otp: string, medidor: string): boolean {
  const normalized = otp.replace(/\D/g, "")
  return normalized.length === 4 && normalized === getMedidorSuffix(medidor)
}

export function isSocioVerified(): boolean {
  if (typeof window === "undefined") return false
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const data = JSON.parse(raw) as SocioVerifiedSession
    return data.socioId === GDCV_SOCIO_DEMO_ID
  } catch {
    return false
  }
}

export function setSocioVerified(): void {
  const payload: SocioVerifiedSession = {
    socioId: GDCV_SOCIO_DEMO_ID,
    verifiedAt: Date.now(),
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearSocioVerified(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
