'use client'

import { useEffect, useRef } from 'react'

interface WaveBackgroundProps {
  children: React.ReactNode
  containerClassName?: string
}

export function WaveBackground({ children, containerClassName = '' }: WaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const SEPARATION = 32
    const DOT_RADIUS = 1.2
    let count = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let x = 0; x < canvas.width; x += SEPARATION) {
        for (let y = 0; y < canvas.height; y += SEPARATION) {
          const dx = x - canvas.width / 2
          const dy = y - canvas.height / 2
          const distance = Math.sqrt(dx * dx + dy * dy)

          const wave = Math.sin(distance * 0.015 - count * 0.04)
          const wave2 = Math.cos(distance * 0.01 - count * 0.02)

          const offsetX = x + (dx / distance) * wave * 12
          const offsetY = y + (dy / distance) * wave2 * 12

          const alpha = 0.08 + (wave + 1) * 0.1
          const radius = DOT_RADIUS + (wave + 1) * 0.5

          ctx.beginPath()
          ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2)
          // Green 500 (#22C55E) con alpha muy bajo
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`
          ctx.fill()
        }
      }

      count += 1
      requestAnimationFrame(animate)
    }

    animate()

    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div className={`relative w-full bg-background-subtle overflow-hidden ${containerClassName}`}>
      {/* Orbes de luz animadas - Green sutiles */}
      <div className="absolute top-[15%] left-[8%] w-[400px] h-[400px] bg-gradient-to-t from-transparent via-green-500 to-green-500 rounded-full blur-[100px] opacity-[0.12] mix-blend-multiply animate-float"></div>
      <div className="absolute bottom-[15%] right-[12%] w-[450px] h-[450px] bg-gradient-to-t from-transparent via-green-600 to-green-600 rounded-full blur-[100px] opacity-[0.08] mix-blend-multiply animate-float" style={{ animationDelay: '-5s' }}></div>

      {/* Canvas con ondas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Contenido */}
      <div className="relative z-20 w-full">
        {children}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
          100% { transform: translate(-30px, 60px) scale(0.95); }
        }
        .animate-float {
          animation: float 20s infinite ease-in-out alternate;
        }
      `}</style>
    </div>
  )
}
