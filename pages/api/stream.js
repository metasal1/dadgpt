export default async function handler(req, res) {

  const { answer } = req.body;
  if (req.method === 'POST') {

    if (!answer) {
      res.status(400).json({ error: 'Missing answer' })
      return;
    }

    const request = await fetch('https://play.ht/api/v2/tts/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PLAYHT_TOKEN}`,
        'X-User-Id': process.env.PLAYHT_USER_ID,
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        "text": answer,
        "voice": "s3://voice-cloning-zero-shot/86cc02af-4340-4b54-8fcb-6a870b6c9bd2/toly/manifest.json",
      })
    })
    const response = await request.text()
    console.log(response)
    // {
    //     "href": "https://play.ht/api/v2/tts/1cZX4jHj2uleGp4KBu?format=audio-mpeg",
    //     "method": "GET",
    //     "contentType": "audio/mpeg",
    //     "rel": "self",
    //     "description": "URL that allows immediate, playable, audio byte streaming of the generated speech"
    // }
    res.status(200).json({ answer, response })

  } else {
    res.status(403).json({ error: 'Not allowed, try POST' })
  }

}