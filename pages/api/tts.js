import fetch from 'node-fetch';

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    const { answer } = req.body;

    if (!answer) {
        res.status(400).json({ error: 'Missing answer' })
        return;
    }

    const voice = "s3://voice-cloning-zero-shot/86cc02af-4340-4b54-8fcb-6a870b6c9bd2/toly/manifest.json"
    const url = 'https://play.ht/api/v2/tts/stream';
    const headers = {
        'Authorization': 'Bearer ' + process.env.PLAYHT_TOKEN,
        'x-user-Id': process.env.PLAYHT_USER_ID,
        'Content-Type': 'application/json'
    };
    const body = JSON.stringify({ text: answer, voice });

    const playHtResponse = await fetch(url, { method: 'POST', headers, body });

    // Forward the response to the client
    res.status(playHtResponse.status);
    playHtResponse.body.pipe(res);
};
