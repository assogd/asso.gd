export default async (req, res) => {
  const { email } = req.body

  try {
    console.log(email)
    return res.status(200).json({
      message:
        'You have been successfully added to the list of attendees. Thank you!'
    })
  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({
      error:
        error.message || 'An unexpected error occurred during your sign-up.'
    })
  }
}
