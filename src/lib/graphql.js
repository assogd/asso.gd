import { IS_DEV_MODE } from '@/lib/config'

export async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`
    },
    body: JSON.stringify({ query, variables }),
    cache: IS_DEV_MODE ? 'no-store' : 'force-cache'
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`GraphQL errors: ${responseText}`)
  }

  const jsonResponse = JSON.parse(responseText)

  if (jsonResponse.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(jsonResponse.errors)}`)
  }

  return jsonResponse.data
}
