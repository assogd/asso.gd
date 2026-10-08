import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

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

      return internalHref ? (
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
    }
  }
}

export function Caption({ children, onLinkClick }) {
  return (
    <span style={{ whiteSpace: 'pre-line' }}>
      <ReactMarkdown components={buildComponents(onLinkClick)}>
        {children || 'Untitled'}
      </ReactMarkdown>
    </span>
  )
}
