import { describe, it, expect } from "vitest"

import { puedeVerSocios } from "@/lib/ingresos-permisos"

describe("puedeVerSocios", () => {
  it("permite HINS_ADMIN y AGC", () => {
    expect(puedeVerSocios("HINS_ADMIN")).toBe(true)
    expect(puedeVerSocios("AGC")).toBe(true)
  })
  it("deniega dueño GDD, socio y rol desconocido", () => {
    expect(puedeVerSocios("GDD_OWNER")).toBe(false)
    expect(puedeVerSocios("SOCIO")).toBe(false)
    expect(puedeVerSocios(null)).toBe(false)
    expect(puedeVerSocios(undefined)).toBe(false)
  })
})
