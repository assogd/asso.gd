export const GalleryById = `
  query GalleryById($id: ID!) {
    gallery(where: { id: $id }) {
      id
      title
      content {
        ... on Slide {
          id
          assets {
            ... on Image {
              __typename
              id
              file {
                height
                url(
                  transformation: {document: {output: {format: webp}}, image: {resize: {height: 1200, width: 1600}}}
                )
                width
              }
              className
            }
            ... on Video {
              __typename
              id
              file
              className
            }
          }
          caption {
            raw
          }
        }
      }
    }
  }
`
