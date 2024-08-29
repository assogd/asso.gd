export const AllProjects = `
  query AllProjects {
    projects {
      id
      slug
    }
  }
`

export const SingleProject = `
  query SingleProject($slug: String!) {
    project(where: { slug: $slug }) {
      id
      client {
         name
         url
       }
       content {
         ... on Image {
           __typename
           id
           className
           caption {
             raw
           }
           file {
             height
             url(
               transformation: {document: {output: {format: avif}}, image: {resize: {width: 1200}}}
             )
             width
           }
         }
         ... on TextBlock {
           __typename
           id
           content {
             raw
           }
         }
         ... on Video {
           __typename
           id
           caption {
             raw
           }
           muted
           file
           controls
           className
         }
       }
       director {
         name
       }
       slug
       title
       type
    }
  }
`

export const SingleProjectSeo = `
  query SingleProject($slug: String!) {
    project(where: { slug: $slug }) {
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
