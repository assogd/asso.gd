export const AllPosts = `
  query AllPosts {
    posts(orderBy: createdAt_DESC) {
      content {
        ... on Image {
          __typename
          id
          image {
            height
            url(
              transformation: {document: {output: {format: webp}}, image: {resize: {width: 800}}}
            )
            width
          }
          alt
          caption {
            raw
            text
          }
        }
        ... on ModelRef {
          __typename
          id
          project {
            ... on Project {
              __typename
              id
              directors {
                slug
                title
              }
              keyAttributes {
                id
                key
                value
              }
              slug
              title
              video {
                caption {
                  raw
                }
                file
              }
              preview {
                caption {
                  raw
                }
                file
              }
            }
          }
        }
        ... on Text {
          __typename
          id
          body {
            raw
          }
        }
        ... on Video {
          __typename
          id
          file
          caption {
            raw
            text
          }
        }
      }
      cta {
        value
        href
        reference {
          ... on Director {
            __typename
            id
            slug
          }
          __typename
          ... on Page {
            id
            slug
          }
          ... on Project {
            __typename
            id
            slug
          }
        }
      }
      id
      title
    }
  }
`
