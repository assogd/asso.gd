'use client'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { motion } from 'framer-motion'

export const BackButton = ({ children, className }) => {
  const router = useRouter()

  return (
    <button
      className={clsx(className, '')}
      type="button"
      onClick={() => router.back()}
    >
      {children}
    </button>
  )
}

export const Button = ({ onTap, children, className }) => {
  return (
    <motion.button
      onTap={onTap}
      className={clsx('unset whitespace-nowrap', className)}
    >
      {children}
    </motion.button>
  )
}
