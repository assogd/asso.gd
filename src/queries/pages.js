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
          content {
            raw
          }
          className
        }
        ... on Image {
          __typename
          id
          file {
            height
            url(
              transformation: {document: {output: {format: webp}}, image: {resize: {width: 800}}}
            )
            width
          }
          caption
          className
        }
        ... on EntrySection {
          __typename
          id
          className
          reference {
            ... on Profile {
              __typename
              id
              name
              icon {
                height
                id
                url(
                  transformation: {document: {output: {format: webp}}, image: {resize: {fit: max, height: 180, width: 180}}}
                )
                width
              }
              slug
              location
              url
              description { raw }
              providedServices
            }
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
