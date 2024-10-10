export const LatestAnnouncement = `
  query Settings {
    settingss(orderBy: updatedAt_DESC, first: 1) {
      id
      announcement {
        raw
      }
    }
  }
`
