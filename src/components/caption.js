'use client'

import { createContext, useContext } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Blink } from './blink'

// Links inside ==highlight== markup (e.g. ==[text](url)==) blink.
const HighlightedContext = createContext(false)

function Highlighted({ children }) {
  return (
    <HighlightedContext.Provider value={true}>
      {children}
    </HighlightedContext.Provider>
  )
}

function MaybeBlink({ children }) {
  const highlighted = useContext(HighlightedContext)

  return highlighted ? <Blink>{children}</Blink> : children
}

const linkStyle = { textDecorationThickness: '1px', textUnderlineOffset: '3px' }

// Links to asso.gd (or its subdomains) are treated as internal, so they
// navigate client-side instead of reloading the page.
function toInternalHref(href) {
  if (!href) return null
  if (href.startsWith('/')) return href

  try {
    const url = new URL(href)
    const isSiteHost =
      url.hostname === 'asso.gd' || url.hostname.endsWith('.asso.gd')

    return isSiteHost ? `${url.pathname}${url.search}${url.hash}` : null
  } catch {
    return null
  }
}

function buildComponents(onLinkClick) {
  return {
    p: ({ children }) => <>{children}</>,
    a: ({ href, children }) => {
      const internalHref = toInternalHref(href)

      return (
        <MaybeBlink>
          {internalHref ? (
            <Link
              href={internalHref}
              scroll={false}
              className="link-underline"
              style={linkStyle}
              onClick={onLinkClick}
            >
              {children}
            </Link>
          ) : (
            <a
              href={href}
              className="link-underline"
              style={linkStyle}
              onClick={onLinkClick}
            >
              {children}
            </a>
          )}
        </MaybeBlink>
      )
    }
  }
}

export function Caption({ children, onLinkClick }) {
  const components = buildComponents(onLinkClick)
  // Odd segments sit between a pair of == markers.
  const segments = (children || 'Untitled').split(/==(.+?)==/gs)

  return (
    <span style={{ whiteSpace: 'pre-line' }}>
      {segments.map((segment, index) => {
        if (!segment) return null
        const markdown = (
          <ReactMarkdown components={components}>{segment}</ReactMarkdown>
        )

        return index % 2 ? (
          <Highlighted key={index}>{markdown}</Highlighted>
        ) : (
          <span key={index}>{markdown}</span>
        )
      })}
    </span>
  )
}
