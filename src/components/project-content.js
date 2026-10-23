import { FadeImage } from './fade-image'
import clsx from 'clsx'
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
  if (node.props && node.props.children != null)
    return getText(node.props.children)
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
  h1: ({ children }) => <h2 className="mb-6">{children}</h2>,
  h2: ({ children }) => <h2 className="mb-6">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-4 mt-8">{children}</h3>,
  h4: ({ children }) => (
    <h4 className="mb-4 mt-8 text-sm uppercase">{children}</h4>
  ),
  p: ({ children }) => {
    if (typeof children === 'string' && children.trimStart().startsWith('>')) {
      return (
        <blockquote className="mx-auto max-w-[48rem] whitespace-pre-line meta-title">
          {children.trimStart().slice(1).trimStart()}
        </blockquote>
      )
    }

    return <p className="mb-4 whitespace-pre-line last:mb-0">{children}</p>
  },
  blockquote: ({ children }) => (
    <blockquote className="mx-auto mb-4 max-w-[48rem] meta-title">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-none border max-w-md mx-auto last:mb-0 text-sm leading-[1.2em]">
      {children}
    </ul>
  ),
  li: ({ children }) => {
    const split = splitListItemAtColon(children)
    const keyText = split ? getText(split.key).trim() : ''

    if (split && keyText) {
      return (
        <li className="px-4 py-5 border-b last:border-b-0 grid gap-1">
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
      return <li className="px-4 py-5 border-b last:border-b-0">{children}</li>
    }

    return (
      <li className="grid gap-y-1 sm:gap-y-0 p-3 sm:p-4 sm:py-4 border-b last:border-b-0">
        <span>{nodes.slice(0, emphasisIndex)}</span>
        <span>{nodes.slice(emphasisIndex)}</span>
      </li>
    )
  },
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal pl-5 last:mb-0">{children}</ol>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline"
    >
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline"
    >
      {children}
    </a>
  )
}

function ProjectMeta({ item, overlay = false, inModal = false }) {
  return (
    <article
      className={`w-full text-center meta-title ${
        overlay
          ? 'project-meta-pair-meta'
          : inModal
            ? 'pt-24 pb-12'
            : 'pt-64 pb-12 sm:pt-36'
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

function ProjectImage({ item, overlay = false, priority = false }) {
  return (
    <figure
      className={`project-image flex w-full flex-col items-center${
        overlay
          ? ' max-w-[70vw] md:max-w-[24rem] relative z-10 project-meta-pair-image'
          : ' max-w-xl'
      }`}
    >
      <div className="relative aspect-[6/5] sm:aspect-auto w-full">
        <FadeImage
          src={item.image.url}
          alt={item.image.alt || item.title || 'Asso archive image'}
          fill
          priority={priority}
          fade={!priority}
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
 * centered column. An image immediately followed by a meta block scrolls over
 * that block while the meta and everything after it stay put; the page only
 * starts scrolling once the image has left the viewport.
 */
export function ProjectContent({ items = [], inModal = false }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="">Not found</p>
      </div>
    )
  }

  const firstImageIndex = items.findIndex((item) => item.image)

  function renderFrom(start) {
    const nodes = []

    for (let index = start; index < items.length; index += 1) {
      const item = items[index]

      if (item.type === 'meta') {
        nodes.push(<ProjectMeta key={item.id} item={item} inModal={inModal} />)
        continue
      }

      if (item.type === 'text') {
        nodes.push(
          <article
            key={item.id}
            className="py-8 w-full max-w-[48rem] text-center"
          >
            {item.content ? (
              <ReactMarkdown components={markdownComponents}>
                {item.content}
              </ReactMarkdown>
            ) : (
              <>
                {item.title && <h2 className="mb-4">{item.title}</h2>}
                {item.description && <p>{item.description}</p>}
              </>
            )}
          </article>
        )
        continue
      }

      if (items[index + 1]?.type === 'meta') {
        // The pair holds every block after it, so they all stay put until
        // the image has scrolled out of view.
        nodes.push(
          <ProjectMetaPair
            key={item.id}
            image={
              <ProjectImage
                item={item}
                overlay
                priority={index === firstImageIndex}
              />
            }
            meta={<ProjectMeta item={items[index + 1]} overlay />}
          >
            {renderFrom(index + 2)}
          </ProjectMetaPair>
        )
        break
      }

      nodes.push(
        <ProjectImage
          key={item.id}
          item={item}
          priority={index === firstImageIndex}
        />
      )
    }

    return nodes
  }

  return (
    <section
      aria-label="Project contents"
      className={clsx(
        'flex flex-col items-center gap-8 mt-0',
        inModal ? 'px-4' : 'p-4'
      )}
    >
      {renderFrom(0)}
    </section>
  )
}
