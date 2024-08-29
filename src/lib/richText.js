'use client'
import { applyRandomFonts } from '@/lib/text'

export const ParagraphRenderer = ({ children, maxLength }) => {
  if (!children.length) return null

  return children.map((text, index) => (
    <p key={index}>{applyRandomFonts(text, maxLength)}</p>
  ))
}
