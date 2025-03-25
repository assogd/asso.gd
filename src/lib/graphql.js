export async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(process.env.HYGRAPH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`
    },
    body: JSON.stringify({
      query,
      variables
    })
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
