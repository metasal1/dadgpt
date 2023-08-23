export default async function handler(req, res) {

  const { answer } = req.body;
  if (req.method === 'POST') {

    if (!answer) {
      res.status(400).json({ error: 'Missing answer' })
      return;
    }

    const request = await fetch('https://play.ht/api/v2/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PLAYHT_TOKEN}`,
        'X-User-Id': process.env.PLAYHT_USER_ID
      },
      body: JSON.stringify({
        "text": answer,
        "voice": "s3://voice-cloning-zero-shot/86cc02af-4340-4b54-8fcb-6a870b6c9bd2/toly/manifest.json",
      })
    })
    const response = await request.text()
    console.log(response)

    const regex = /"url":"(https:\/\/[^\"]+)"/;
    const match = response.match(regex);

    if (match && match[1]) {
      const url = match[1];
      console.log('Extracted URL:', url); // Output: https://peregrine-results.s3.amazonaws.com/pigeon/2bEetX4n9gMF8QRLgD_0.mp3
      res.status(200).json({ answer, url })
    } else {
      console.log('URL not found');
      res.status(404).json({ answer, response })
    }

  } else {
    res.status(403).json({ error: 'Not allowed, try POST' })
  }

}