'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  children: React.ReactNode
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.1em',
  borderRadius = '100px',
  shimmerDuration = '2s',
  background = 'linear-gradient(90deg, #FCD535 0%, #F97316 100%)',
  className,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      className={cn(
        'relative overflow-hidden px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105',
        className
      )}
      style={{
        background,
        borderRadius,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          opacity: 0.3,
        }}
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: parseFloat(shimmerDuration),
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.button>
  )
}
