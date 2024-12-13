export const useThresholds = (isMobile) => {
  const desktopShortHoldThreshold = 250
  const mobileShortHoldThreshold = 100
  const holdThreshold = 500
  const swipeThreshold = 50

  const shortHoldThreshold = isMobile
    ? mobileShortHoldThreshold
    : desktopShortHoldThreshold

  return { shortHoldThreshold, holdThreshold, swipeThreshold }
}
