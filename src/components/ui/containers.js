'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export const Main = ({ children, className }) => {
  return (
    <main className={clsx('grid grid-cols-12 gap-x-4 gap-y-4', className)}>
      {children}
    </main>
  )
}
