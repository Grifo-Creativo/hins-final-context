// components/gdcv/SocioAuthGate.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import {
  GDCV_SOCIO_DEMO_ID,
  isSocioVerified,
} from "@/lib/gdcv-socio-auth"

const ACCESO_PATH = "/gdcv/socio/acceso"

interface SocioAuthGateProps {
  children: ReactNode
}

export function SocioAuthGate({ children }: SocioAuthGateProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  const isAccesoRoute = pathname === ACCESO_PATH || pathname.startsWith(`${ACCESO_PATH}/`)

  useEffect(() => {
    if (isAccesoRoute) {
      if (isSocioVerified()) {
        router.replace("/gdcv/socio")
        return
      }
      setReady(true)
      return
    }

    if (!isSocioVerified()) {
      router.replace(`${ACCESO_PATH}?socio=${GDCV_SOCIO_DEMO_ID}`)
      return
    }

    setReady(true)
  }, [isAccesoRoute, pathname, router])

  if (!ready) {
    return null
  }

  return <>{children}</>
}
