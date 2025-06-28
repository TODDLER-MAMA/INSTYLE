import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gold-100 overflow-hidden",
        hover && "hover:shadow-xl hover:border-gold-200",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

export default Card