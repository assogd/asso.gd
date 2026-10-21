'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Blink } from './blink'

const linkStyle = { textDecorationThickness: '1px', textUnderlineOffset: '3px' }

function remarkHighlightedLinks() {
  return (tree) => {
    function visit(node) {
      if (node.type === 'link') {
        const textNodes = []
        function collectText(current) {
          if (current.type === 'text') textNodes.push(current)
          current.children?.forEach(collectText)
        }
        node.children.forEach(collectText)

        const first = textNodes[0]
        const last = textNodes[textNodes.length - 1]
        if (first?.value.startsWith('==') && last?.value.endsWith('==')) {
          first.value = first.value.slice(2)
          last.value = last.value.slice(0, -2)
          node.data = {
            ...node.data,
            hProperties: {
              ...node.data?.hProperties,
              'data-highlighted': 'true'
            }
          }
        }
      }
      node.children?.forEach(visit)
    }

    visit(tree)
  }
}

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
    a: ({ href, children, ...props }) => {
      const internalHref = toInternalHref(href)
      const link = internalHref ? (
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
      )

      return props['data-highlighted'] === 'true' ? <Blink>{link}</Blink> : link
    }
  }
}

export function Caption({ children, onLinkClick }) {
  const components = buildComponents(onLinkClick)
  return (
    <span style={{ whiteSpace: 'pre-line' }}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkHighlightedLinks]}
      >
        {children || 'Untitled'}
      </ReactMarkdown>
    </span>
  )
}
