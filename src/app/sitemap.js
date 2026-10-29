import { SITE_URL } from '@/lib/site'
import { getProjectSlugs } from '@/lib/project-slugs'

export default async function sitemap() {
  const slugs = await getProjectSlugs()
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/about`, priority: 0.8 },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/project/${slug}`,
      priority: 0.6
    }))
  ]
}
