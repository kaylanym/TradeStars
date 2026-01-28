'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface SparklesProps {
  id?: string
  className?: string
  children?: React.ReactNode
}

export const Sparkles = ({ id, className, children }: SparklesProps) => {
  const [sparkles, setSparkles] = useState<Array<{
    id: string
    x: string
    y: string
    color: string
    delay: number
    scale: number
  }>>([])

  useEffect(() => {
    const generateSparkle = () => ({
      id: `sparkle-${Date.now()}-${Math.random()}`,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: ['#FCD535', '#F97316', '#8B5CF6'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 2,
      scale: Math.random() * 1 + 0.5,
    })

    const initialSparkles = Array.from({ length: 15 }, generateSparkle)
    setSparkles(initialSparkles)

    const interval = setInterval(() => {
      setSparkles((prevSparkles) => {
        const newSparkles = [...prevSparkles]
        newSparkles.shift()
        newSparkles.push(generateSparkle())
        return newSparkles
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative inline-block ${className}`} id={id}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute inline-block"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, sparkle.scale, 0],
          }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="animate-spin"
            width="20"
            height="20"
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.span>
      ))}
      {children}
    </div>
  )
}
