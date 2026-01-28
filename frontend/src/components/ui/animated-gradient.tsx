'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedGradientProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export function AnimatedGradient({
  children,
  className,
  containerClassName,
}: AnimatedGradientProps) {
  return (
    <div className={cn('relative', containerClassName)}>
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary blur-3xl opacity-20',
          className
        )}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
