import { MongoClient } from 'mongodb';

export default async function handler(req, res) {

  const { question } = req.body;
  if (req.method === 'POST') {

    if (!question) {
      res.status(400).json({ error: 'Missing question' })
      return;
    }

    if (question === 'test') {
      res.status(200).json({ question, answer: 'test', ip })
      return;
    }

    const request = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ "role": "system", "content": "answer as if you are Anatoly Yakovenko, the founder of Solana, he loves beer, coffee and underwater ice hockey, try to keep the answer under 20 seconds" }, { "role": "user", "content": question }],
        temperature: 1,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    })
    const response = await request.json();
    console.log(response)
    const answer = response.choices[0].message.content;
    console.log('Answer:', answer);

    const url = process.env.MONGODB_URI;
    const dbName = 'dadgpt';
    const collectionName = 'queries';

    const data = {
      question,
      answer,
    };
    MongoClient.connect(url)
      .then(client => {
        const db = client.db(dbName);
        db.collection(collectionName).insertOne(data)
          .then(result => {
            console.log('Data saved to MongoDB:', result);
            client.close();
          })
          .catch(err => {
            console.error('Error saving data to MongoDB:', err);
          });
      })
      .catch(err => {
        console.error('Error connecting to MongoDB:', err);
      });


    res.status(200).json({ question, answer })
    return answer;
  } else {
    res.status(400).json({ error: 'Not allowed, try POST' })
  }

}