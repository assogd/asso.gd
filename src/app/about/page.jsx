import ReactMarkdown from 'react-markdown'
import siteContent from '@/content/site.json'
import { getAboutContent } from '@/lib/about'
import { AlternatingCharactersColorBlink } from '@/components/ui/animations'

export async function generateMetadata() {
  const { title, description } = siteContent.seo.about

  return {
    title,
    description,
    openGraph: { description }
  }
}

function renderMarkdown(content) {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function renderMarkdownInGrid(content, className) {
  return <div className={className}>{renderMarkdown(content)}</div>
}

const addressGridClasses = [
  'sm:col-start-1 sm:col-end-4',
  'sm:col-start-4 sm:col-end-7',
  'sm:col-start-2 sm:col-end-5',
  'sm:col-start-5 sm:col-end-8',
  'sm:col-start-3 sm:col-end-6'
]

export default async function About() {
  const content = getAboutContent()
  const addressSection = content.sections.find(
    (section) => section.title === 'Our addresses'
  )
  const addressEntries = addressSection?.content
    .split(/^### /m)
    .filter(Boolean)
    .map((entry) => {
      const [title, ...body] = entry.split('\n')
      return { title: title.trim(), content: body.join('\n').trim() }
    })

  return (
    <main className="grid gap-y-6 pt-0 pb-4">
      <h1 className="sr-only">
        About Asso, a design studio based in Stockholm, Sweden
      </h1>
      <section className="grid grid-cols-12 gap-x-2 px-2 sm:px-4 mt-4 sm:mt-0">
        {renderMarkdownInGrid(content.intro, 'col-start-1 col-end-12')}
      </section>
      {!content.announcement_hidden &&
        content.sections
          .filter((section) => section.title === 'Announcement')
          .map((section) => (
            <section key={section.title} className="grid grid-cols-12 gap-x-2 px-4">
              <h2 className="col-start-2 col-end-12">
                <AlternatingCharactersColorBlink text={section.title} />
              </h2>
              {renderMarkdownInGrid(section.content, 'col-start-1 col-end-12')}
            </section>
          ))}
      {addressEntries && (
        <section className="grid grid-cols-1 gap-y-3 px-2 sm:px-4 sm:grid-cols-12 sm:gap-x-2">
          <h2 className="col-span-1 sm:col-start-2 sm:col-end-12">
            {addressSection.title}
          </h2>
          {addressEntries.map((entry, index) => (
            <div
              key={entry.title}
              className={`col-span-1 ${addressGridClasses[index] || ''}`}
            >
              <h3>{entry.title}</h3>
              {renderMarkdown(entry.content)}
            </div>
          ))}
        </section>
      )}
      {content.sections
        .filter((section) => section.title === 'Credits')
        .map((section) => (
          <section key={section.title} className="grid grid-cols-12 gap-y-0 px-4 pt-32 sm:pt-24">
            <h2 className="col-start-2 col-end-12">{section.title}</h2>
            {renderMarkdownInGrid(section.content, 'col-start-1 col-end-12')}
          </section>
        ))}
    </main>
  )
}
