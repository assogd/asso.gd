import React from 'react'

export function formatNames(names) {
  if (!names || names.length === 0) {
    return ''
  }

  if (names.length === 1) {
    return `by ${names[0]}`
  } else if (names.length === 2) {
    return `by ${names[0]} and ${names[1]}`
  } else {
    const lastTitle = names.pop()
    return `by ${names.join(', ')} and ${lastTitle}`
  }
}

export function replaceHyphenWithEnDash(inputString) {
  return inputString?.replace(/ - /g, ' – ')
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
