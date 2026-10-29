import { Fragment } from 'react'
import ReactMarkdown from 'react-markdown'
import siteContent from '@/content/site.json'
import { FadeImage } from '@/components/fade-image'
import { Marquee } from '@/components/marquee'
import altText from '@/content/alt.json'
import { getAboutContent } from '@/lib/about'

export async function generateMetadata() {
  const { title, description } = siteContent.seo.about

  return {
    title,
    description,
    openGraph: { description }
  }
}

function renderMarkdown(content, components) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ node, ...props }) => <h2 {...props} className="ml-6" />,
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        ...components
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// A block where each non-empty line is ==highlighted== becomes a marquee.
const isHighlight = (content) => {
  const lines = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return lines.length > 0 && lines.every((line) => /^==.+==$/.test(line))
}

function renderMarquee(content) {
  const items = content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) =>
      renderMarkdown(line.replace(/^==|==$/g, '').trim(), {
        p: ({ node, children }) => <span key={index}>{children}</span>
      })
    )

  return <Marquee key={content} items={items} className="col-span-full mt-5" />
}

// Static so Tailwind can see them. Two paragraphs per line, three columns
// wide each; every other line is moved one column to the right (from `sm` up).
const LADDER_COLUMNS = [
  'sm:col-start-1 sm:col-end-4',
  'sm:col-start-4 sm:col-end-7',
  'sm:col-start-2 sm:col-end-5',
  'sm:col-start-5 sm:col-end-8'
]

const isLadder = (content) => content.startsWith('## Our addresses')

function renderLadder(content) {
  const [heading, ...paragraphs] = content.split(/\n{2,}/)
  let position = 0

  return (
    <>
      {renderMarkdown(heading, {
        h2: ({ node, ...props }) => (
          <h2 {...props} className="sm:col-span-full" />
        )
      })}
      {paragraphs.map((paragraph, index) => {
        if (isHighlight(paragraph)) return renderMarquee(paragraph)
        const column = LADDER_COLUMNS[position++ % 4]
        return (
          <Fragment key={index}>
            {renderMarkdown(paragraph, {
              p: ({ node, ...props }) => <p {...props} className={column} />
            })}
          </Fragment>
        )
      })}
    </>
  )
}

// Plain paragraphs stay together as one markdown run; highlighted ones break
// the run to become marquees.
function renderBlock(content) {
  if (isLadder(content)) return renderLadder(content)
  if (isHighlight(content)) return renderMarquee(content)

  const parts = []
  let run = []
  const flush = () => {
    if (run.length) parts.push(renderMarkdown(run.join('\n\n')))
    run = []
  }
  content.split(/\n{2,}/).forEach((paragraph) => {
    if (isHighlight(paragraph)) {
      flush()
      parts.push(renderMarquee(paragraph))
    } else {
      run.push(paragraph)
    }
  })
  flush()

  return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>)
}

export default async function About() {
  const { blocks } = await getAboutContent()

  return (
    <main className="grid gap-y-10 px-2 sm:px-4 pt-4 pb-4 max-w-3xl">
      <h1 className="sr-only">
        About Asso, a design studio based in Stockholm, Sweden
      </h1>
      {blocks.map((block, index) => {
        const content =
          block.type === 'image' ? (
            <div
              className="relative w-full"
              style={{
                aspectRatio:
                  block.width && block.height
                    ? `${block.width} / ${block.height}`
                    : '4 / 3'
              }}
            >
              <FadeImage
                src={block.src}
                alt={altText[block.id] || block.title || 'Asso studio image'}
                fill
                className="object-contain"
                sizes="(min-width: 768px) 48rem, 100vw"
                quality={90}
              />
            </div>
          ) : (
            renderBlock(block.content)
          )

        return index === blocks.length - 1 ? (
          <footer
            key={block.id}
            className="pt-32 sm:pt-24 text-sm leading-[1.2em]"
          >
            {content}
          </footer>
        ) : block.type === 'image' ? null : (
          <section
            key={block.id}
            className={`grid gap-4${
              block.type === 'text' && isLadder(block.content)
                ? ' sm:grid-cols-12 sm:gap-x-2'
                : ''
            }`}
          >
            {content}
          </section>
        )
      })}
    </main>
  )
}
