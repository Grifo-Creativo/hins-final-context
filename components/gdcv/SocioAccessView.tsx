// components/gdcv/SocioAccessView.tsx
"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { socioNombre, socioParkName } from "@/data/gdcv-socio-mock"
import {
  getDemoSocio,
  setSocioVerified,
  validateSocioOtp,
} from "@/lib/gdcv-socio-auth"

export function SocioAccessView() {
  const router = useRouter()
  const labelId = useId()
  const otpId = useId()
  const demoSocio = getDemoSocio()

  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!demoSocio) return

    setError(null)
    setIsSubmitting(true)

    if (!validateSocioOtp(otp, demoSocio.medidor)) {
      setError("Los dígitos no coinciden con tu medidor. Revisá e intentá de nuevo.")
      setIsSubmitting(false)
      return
    }

    setSocioVerified()
    router.replace("/gdcv/socio")
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <Card className="w-full max-w-md rounded-xl border-0 bg-white p-6 shadow-xs">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">{socioParkName}</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Verificá tu acceso
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hola, {socioNombre}. Ingresá los últimos 4 dígitos de tu N° de medidor
            para ver tu espacio personal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Label
              id={labelId}
              htmlFor={otpId}
              className="text-sm font-medium text-muted-foreground"
            >
              Últimos 4 dígitos del medidor
            </Label>
            <InputOTP
              id={otpId}
              maxLength={4}
              value={otp}
              onChange={(value) => {
                setOtp(value)
                if (error) setError(null)
              }}
              disabled={isSubmitting}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              aria-labelledby={labelId}
              aria-invalid={error ? true : undefined}
            >
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:size-11 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-input *:data-[slot=input-otp-slot]:text-base *:data-[slot=input-otp-slot]:first:rounded-md *:data-[slot=input-otp-slot]:last:rounded-md">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            {error ? (
              <p className="text-center text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full shadow-xs"
            disabled={otp.length < 4 || isSubmitting}
          >
            Continuar
          </Button>
        </form>
      </Card>
    </div>
  )
}
