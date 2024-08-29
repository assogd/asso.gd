export const SingleDirector = `
  query SingleDirector($slug: String!) {
    director(where: { slug: $slug }) {
      id
      biography {
        raw
      }
      projects {
        id
        slug
        title
        keyAttributes {
          id
          key
          value
        }
        additionalAttributes {
          id
          key
          value
        }
        video {
          id
          file
          clippedPlaybackId
        }
        preview {
          id
          file
        }
      }
      title
      projectOverviewGridColumns
      slug
    }
  }
`

export const SingleDirectorSeo = `
  query SingleDirector($slug: String!) {
    director(where: { slug: $slug }) {
      id
      title
      slug
      seo {
        title
        description
        image {
          url(
            transformation: {document: {output: {format: jpg}}, image: {resize: {fit: crop, height: 900, width: 1200}}}
          )
        }
      }
    }
  }
`
