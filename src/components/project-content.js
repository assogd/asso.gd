import Image from 'next/image'
import { Children, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import { ProjectMetaPair } from './project-meta-pair'

// Recursively flattens React children (strings, numbers, nested elements)
// into their plain-text content, e.g. for locating a colon inside a
// markdown list item regardless of any inline formatting.
function getText(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getText).join('')
  if (node.props && node.props.children != null) return getText(node.props.children)
  return ''
}

// Splits a list item's children at its first colon into `{ key, value }`
// node arrays, e.g. "Editor: Hendrik" -> key: "Editor", value: "Hendrik".
// Returns null when there's no colon, or when the colon falls inside a
// formatted inline node (link, bold, etc.) rather than plain text.
function splitListItemAtColon(children) {
  const nodes = Array.isArray(children) ? children : [children]
  const fullText = nodes.map(getText).join('')
  const colonIndex = fullText.indexOf(':')
  if (colonIndex === -1) return null

  const keyNodes = []
  const valueNodes = []
  let offset = 0
  let colonConsumed = false

  for (const node of nodes) {
    if (colonConsumed) {
      valueNodes.push(node)
      continue
    }

    const nodeText = getText(node)
    const nodeEnd = offset + nodeText.length

    if (colonIndex >= nodeEnd) {
      keyNodes.push(node)
      offset = nodeEnd
      continue
    }

    if (typeof node === 'string' || typeof node === 'number') {
      const str = String(node)
      const localIndex = colonIndex - offset
      const before = str.slice(0, localIndex)
      const after = str.slice(localIndex + 1)
      if (before) keyNodes.push(before)
      if (after.trim()) valueNodes.push(after)
      colonConsumed = true
    } else {
      // Colon is inside a formatted node — bail out rather than splitting mid-element.
      return null
    }

    offset = nodeEnd
  }

  return { key: keyNodes, value: valueNodes }
}

const markdownComponents = {
  h1: ({ children }) => <h2 className="mb-4">{children}</h2>,
  h2: ({ children }) => <h2 className="mb-6">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-8">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-3 mt-10 uppercase text-[0.7em] !tracking-[1.2em]">{children}</h4>,
  p: ({ children }) => {
    if (typeof children === 'string' && children.trimStart().startsWith('>')) {
      return (
        <blockquote className="mx-auto max-w-[48rem] meta-title">
          {children.trimStart().slice(1).trimStart()}
        </blockquote>
      )
    }

    return <p className="mb-4 last:mb-0">{children}</p>
  },
  blockquote: ({ children }) => (
    <blockquote className="mx-auto mb-4 max-w-[48rem] meta-title">{children}</blockquote>
  ),
  ul: ({ children }) => <ul className="mb-4 list-none border max-w-md mx-auto last:mb-0">{children}</ul>,
  li: ({ children }) => {
    const split = splitListItemAtColon(children)
    const keyText = split ? getText(split.key).trim() : ''

    if (split && keyText) {
      return (
        <li className="px-2 py-5 border-b last:border-b-0 grid gap-1">
          <span>{split.value}</span>
          <span className="italic">{split.key}</span>
        </li>
      )
    }

    const nodes = Children.toArray(children)
    const emphasisIndex = nodes.findIndex(
      (node) => isValidElement(node) && node.type === 'em'
    )

    if (emphasisIndex === -1) {
      return <li className="px-2 py-5 border-b last:border-b-0">{children}</li>
    }

    return (
      <li className="grid px-2 py-5 border-b last:border-b-0">
        <span>{nodes.slice(0, emphasisIndex)}</span>
        <span>{nodes.slice(emphasisIndex)}</span>
      </li>
    )
  },
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-5 last:mb-0">{children}</ol>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
      {children}
    </a>
  )
}

// Meta block field values are single lines, so links render inline
// (no wrapping <p>) but should still open in a new tab. Lists render
// unstyled (no bullets/markers) since a meta field is not a real list.
const inlineMarkdownComponents = {
  p: ({ children }) => <>{children}</>,
  ul: ({ children }) => <ul className="list-none pl-0">{children}</ul>,
  ol: ({ children }) => <ol className="list-none pl-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline">
      {children}
    </a>
  )
}

function ProjectMeta({ item, overlay = false }) {
  return (
    <article
      className={`w-full text-center pt-36 pb-12 meta-title${
        overlay ? ' project-meta-pair-meta' : ''
      }`}
    >
      <div className={overlay ? 'project-meta-pair-content' : ''}>
        {item.title && <h2>{item.title}</h2>}
        {item.fields.map(({ key, value }) => (
          <p key={key}>
            <span className="italic">{key}</span> …{' '}
            <span className="uppercase">
              <ReactMarkdown components={inlineMarkdownComponents}>
                {value}
              </ReactMarkdown>
            </span>
          </p>
        ))}
      </div>
    </article>
  )
}

function ProjectImage({ item, overlay = false }) {
  return (
    <figure
      className={`flex w-full max-w-[20rem] sm:max-w-[26rem] flex-col items-center${
        overlay ? ' relative z-10 project-meta-pair-image' : ''
      }`}
    >
      <div className="relative aspect-[6/5] w-full">
        <Image
          src={item.image.url}
          alt={item.image.alt || item.title || 'Asso archive image'}
          fill
          className="object-contain"
          sizes="(min-width: 640px) 30rem, 100vw"
          quality={90}
        />
      </div>
    </figure>
  )
}

/**
 * Simple, non-interactive rendering of a project's images and text blocks
 * for /project/[slug] and its intercepted modal. Unlike the home feed's
 * ArenaImageWall, tiles here are not clickable and are laid out as a single
 * centered column. An image immediately followed by a meta block sticks over
 * that block while scrolling.
 */
export function ProjectContent({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="">Not found</p>
      </div>
    )
  }

  return (
    <section aria-label="Project contents" className="flex flex-col items-center gap-8 p-4 mt-0">
      {items.map((item, index) => {
        if (item.type === 'meta') {
          return items[index - 1]?.image ? null : (
            <ProjectMeta key={item.id} item={item} />
          )
        }

        if (item.type === 'text') {
          return (
            <article key={item.id} className="py-8 w-full max-w-[48rem] text-center">
              {item.content ? (
                <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
              ) : (
                <>
                  {item.title && <h2 className="mb-4">{item.title}</h2>}
                  {item.description && <p>{item.description}</p>}
                </>
              )}
            </article>
          )
        }

        const followsWithMeta = items[index + 1]?.type === 'meta'

        if (followsWithMeta) {
          return (
            <ProjectMetaPair
              key={item.id}
              image={<ProjectImage item={item} overlay />}
              meta={<ProjectMeta item={items[index + 1]} overlay />}
            />
          )
        }

        return <ProjectImage key={item.id} item={item} />
      })}
    </section>
  )
}
