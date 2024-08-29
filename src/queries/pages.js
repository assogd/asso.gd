export const AllPages = `
  query AllPages {
    pages {
      id
      slug
    }
  }
`

export const SinglePage = `
  query SinglePage($slug: String!) {
    page(where: { slug: $slug }) {
      id
      slug
      title
      content {
        ... on Text {
          id
          __typename
          body {
            raw
          }
        }
      }
    }
  }
`

export const SinglePageSeo = `
  query SinglePage($slug: String!) {
    page(where: { slug: $slug }) {
      id
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
