import siteContent from '@/content/site.json'
import { SITE_URL } from '@/lib/site'
import { getProjectSlugs } from '@/lib/project-slugs'

export async function GET() {
  const slugs = await getProjectSlugs()
  const body = [
    '# Asso',
    '',
    `> ${siteContent.seo.home.description}`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}): Selected work`,
    `- [About](${SITE_URL}/about): The studio, services, contact and addresses`,
    ...(slugs.length
      ? ['', '## Projects', '', ...slugs.map((s) => `- [${s}](${SITE_URL}/project/${s})`)]
      : []),
    ''
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
