import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  variant?: 'default' | 'glass' | 'elevated'
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = true, 
  variant = 'default' 
}) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-lg",
    glass: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl",
    elevated: "bg-white border border-gray-100 shadow-2xl"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        "rounded-3xl overflow-hidden transition-all duration-300",
        variants[variant],
        hover && "hover:shadow-2xl hover:border-gray-200",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default Card