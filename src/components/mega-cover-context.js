'use client'
import { createContext, useContext, useState } from 'react'

// Create Context
const MegaCoverContext = createContext()

// Custom Hook to Use Context
export const useMegaCover = () => useContext(MegaCoverContext)

// Context Provider Component
export const MegaCoverProvider = ({ children }) => {
  const [hasRun, setHasRun] = useState(false)

  return (
    <MegaCoverContext.Provider value={{ hasRun, setHasRun }}>
      {children}
    </MegaCoverContext.Provider>
  )
}
