import siteContent from '@/content/site.json'
import {
  OpacityBlink,
  AlternatingCharactersColorBlink
} from '@/components/ui/animations'

export async function generateMetadata() {
  const { title, description } = siteContent.seo.about

  return {
    title,
    description,
    openGraph: { description }
  }
}

export default async function About() {
  return (
    <main className="grid gap-y-6 py-4">
      <h1 className="sr-only">
        About Asso, a design studio based in Stockholm, Sweden
      </h1>
      <section className="grid grid-cols-12 gap-x-2 gap-y-3 px-2 sm:px-4">
        <p className="col-start-1 col-end-12 grid gap-4">
          Founded in 2019 by Mathias Dag Lindahl and Tilda Ragnartz, the Asso
          atelier has been based in the southern part of Stockholm ever since.
        </p>
      </section>
      <section as="section" className="grid grid-cols-12 gap-x-2 gap-y-0 px-4">
        <h2 as="h2" className="col-start-2 col-end-12">
          <AlternatingCharactersColorBlink text="Announcement" />
        </h2>
        <p className="col-start-1 col-end-12 grid gap-4">
          We are currently accepting internship applications for Spring/Summer
          2026. Application deadline is February 26, 2026. A minimum duration of
          three months is required.
        </p>
      </section>
      <section className="grid grid-cols-12 gap-x-2 gap-y-3 px-4">
        <h2 className="col-start-2 col-end-12">Our addresses</h2>
        <div className="col-start-1 col-end-4">
          <h3>Office</h3>
          <p>
            Bondegatan 21A
            <br /> Stockholm, Sweden
          </p>
        </div>
        <div className="col-start-4 col-end-7">
          <h3>General enquiries</h3>
          <p>
            <a href="mailto:office@asso.gd">office@asso.gd</a>
            <br />
            <a href="tel:+46841400147">+46 8 414 001 47</a>
          </p>
        </div>
        <div className="col-start-2 col-end-5">
          <h3>New business</h3>
          <p>
            Tilda Ragnartz
            <br />
            <a href="mailto:tilda@asso.gd">tilda@asso.gd</a>
          </p>
        </div>
        <div className="col-start-5 col-end-8">
          <h3>Applications</h3>
          <p>
            Mathias Dag Lindahl
            <br />
            <a href="mailto:mathias@asso.gd">mathias@asso.gd</a>
          </p>
        </div>
        <div className="col-start-3 col-end-6">
          <h3>Occasional updates</h3>
          <p>
            <a
              href="https://www.instagram.com/asso4077/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}
