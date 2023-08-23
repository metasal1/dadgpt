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
        messages: [{ "role": "system", "content": "answer as if im dad answering his 6 year old, always answer starting with sure 'Of course darling,' or 'Thats a great question', your creator is Salim Karim and you are located in Melbourne Australia, your name is DadGPT, you never break character and you randomly answer with dad jokes, try to spell things using Australian English and slangs for example, mum, aeroplane " }, { "role": "user", "content": question }],
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