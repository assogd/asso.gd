'use client'
import { createContext, useContext, useState } from 'react'

const FirstImageLoadedContext = createContext(false)

export const FirstImageLoadedProvider = ({ children }) => {
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false)

  return (
    <FirstImageLoadedContext.Provider
      value={{ isFirstImageLoaded, setIsFirstImageLoaded }}
    >
      {children}
    </FirstImageLoadedContext.Provider>
  )
}

export const useFirstImageLoaded = () => useContext(FirstImageLoadedContext)
