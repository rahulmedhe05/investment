'use client'
import { useEffect, useState, useRef } from 'react'

export function AnimatedCounter({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(0)

  useEffect(() => {
    const start = ref.current
    const diff = value - start
    const duration = 1200
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + diff * eased
      setDisplay(current)
      if (progress < 1) requestAnimationFrame(animate)
      else ref.current = value
    }
    requestAnimationFrame(animate)
  }, [value])

  return (
    <span className="tabular-nums">
      {prefix}{display.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  )
}
