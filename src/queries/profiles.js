export const LastUpdatedProfile = `
  query Profile {
    profiles(orderBy: updatedAt_DESC, first: 1) {
      id
      address
      email
      instagram
      phone
      directors {
        id
        reel {
          file
        }
        slug
        title
      }
    }
  }
`
