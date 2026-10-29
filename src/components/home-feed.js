import { ArenaImageWall } from './arena-image-wall'

/**
 * Home feed image wall. Tiles are displayed without click-to-open previews.
 */
export function HomeFeed({ items }) {
  return <ArenaImageWall items={items} />
}
