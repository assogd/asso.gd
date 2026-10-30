import { FadeImage } from './fade-image'
import clsx from 'clsx'
import { Children, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import { ProjectMetaPair } from './project-meta-pair'
import { TiltFrame } from './tilt-frame'
import { ProjectCarousel } from './project-carousel'
import { Caption } from './caption'

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

// Only the overlay hero image tilts; other images render a plain div.
function Tilt({ overlay, className, children }) {
  if (overlay) return <TiltFrame className={className}>{children}</TiltFrame>
  return <div className={className}>{children}</div>
}

function ProjectImage({ item, overlay = false, priority = false }) {
  const { url, alt, width, height } = item.image
  const hasSize = Boolean(width && height)
  // Portrait images sit in the same 6/5 box as the hero instead of growing tall.
  const useFixedRatio =
    overlay || (hasSize && height > width && item.layout !== 'full')
  const imageProps = {
    src: url,
    alt: alt || item.title || 'Asso archive image',
    priority,
    fade: !priority,
    sizes: item.layout === 'full' ? '100vw' : '(min-width: 640px) 40rem, 100vw',
    quality: 80
  }

  return (
    <figure
      className={clsx(
        'project-image flex flex-col items-center',
        !overlay && 'py-8',
        (overlay || item.layout !== 'full') && 'w-full',
        overlay &&
          'max-w-[70vw] md:max-w-[24rem] relative z-10 project-meta-pair-image',
        !overlay &&
          (item.layout === 'full'
            ? '-mx-4 self-stretch lg:mx-0 lg:w-full lg:max-w-4xl lg:self-center'
            : 'max-w-2xl')
      )}
    >
      {hasSize && useFixedRatio ? (
        <Tilt
          overlay={overlay}
          className={clsx(
            'relative aspect-[6/5] w-full',
            !overlay && 'max-h-[80vh]'
          )}
        >
          <FadeImage
            {...imageProps}
            width={width}
            height={height}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </Tilt>
      ) : hasSize ? (
        <div
          className="relative w-full"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <FadeImage
            {...imageProps}
            width={width}
            height={height}
            className="h-auto w-full"
          />
        </div>
      ) : (
        <div className="relative aspect-[6/5] w-full">
          <FadeImage {...imageProps} fill className="object-contain" />
        </div>
      )}
    </figure>
  )
}

// Two-image collections sit side by side instead of becoming a carousel.
function ProjectImagePair({ images }) {
  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-2 md:gap-3 py-8">
      {images.map(({ id, title, image, figcaption }) => {
        const { url, alt, width, height } = image
        return (
          <figure key={id}>
            <div
              className="relative"
              style={{
                aspectRatio: width && height ? `${width} / ${height}` : '6 / 5'
              }}
            >
              <FadeImage
                src={url}
                alt={alt || title || 'Asso archive image'}
                fill
                fade
                sizes="(min-width: 896px) 28rem, 50vw"
                quality={90}
                className="object-contain"
              />
            </div>
            {figcaption && (
              <figcaption className="mt-1 text-xs">
                <Caption>{figcaption}</Caption>
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
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

  // The first two images load eagerly so the page can wait for them.
  const priorityIndexes = new Set(
    items.flatMap((item, index) => (item.image ? [index] : [])).slice(0, 2)
  )

  function renderFrom(start) {
    const nodes = []

    for (let index = start; index < items.length; index += 1) {
      const item = items[index]

      if (item.type === 'meta') {
        nodes.push(<ProjectMeta key={item.id} item={item} inModal={inModal} />)
        continue
      }

      if (item.type === 'collection') {
        nodes.push(
          item.images.length < 5 ? (
            <ProjectImagePair key={item.id} images={item.images} />
          ) : (
            <ProjectCarousel
              key={item.id}
              images={item.images}
              title={item.title}
            />
          )
        )
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
                priority={priorityIndexes.has(index)}
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
          priority={priorityIndexes.has(index)}
        />
      )
    }

    return nodes
  }

  return (
    <section
      aria-label="Project contents"
      className={clsx(
        'project-blocks flex flex-col items-center mt-0',
        inModal ? 'px-4' : 'p-4'
      )}
    >
      {renderFrom(0)}
    </section>
  )
}
