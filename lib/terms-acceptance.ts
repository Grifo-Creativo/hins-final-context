// lib/terms-acceptance.ts

/** Bump cuando el área legal publique una nueva versión — dispara re-aceptación. */
export const TERMS_VERSION = "1.0"

const TERMS_COOKIE_NAME = "hins_terms_accepted"
const TERMS_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

type TermsAcceptancePayload = {
  v: string
  at: string
}

function readTermsCookie(): TermsAcceptancePayload | null {
  if (typeof document === "undefined") return null

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${TERMS_COOKIE_NAME}=([^;]*)`)
  )
  if (!match?.[1]) return null

  try {
    return JSON.parse(decodeURIComponent(match[1])) as TermsAcceptancePayload
  } catch {
    return null
  }
}

export function hasAcceptedCurrentTerms(): boolean {
  const payload = readTermsCookie()
  return payload?.v === TERMS_VERSION
}

export function setTermsAccepted(): void {
  if (typeof document === "undefined") return

  const payload: TermsAcceptancePayload = {
    v: TERMS_VERSION,
    at: new Date().toISOString(),
  }

  document.cookie = `${TERMS_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=${TERMS_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

/**
 * Persistencia server-side de la aceptación (auditoría legal).
 * TODO: POST /api/legal/acceptances con { termsVersion, acceptedAt, userId }
 */
export async function recordTermsAcceptance(): Promise<void> {
  // Prototipo: solo cookie local. Wire a backend cuando exista auth real.
}
