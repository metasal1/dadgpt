import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const mongoURL = process.env.MONGODB_URI;
  const dbName = 'dadgpt'; // Replace with your specific database name


  try {
    const client = new MongoClient(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    const db = client.db(dbName);
    const last = await db.collection('queries').find().sort({ _id: -1 }).limit(10).toArray();
    const count = await db.collection('queries').countDocuments();
    res.status(200).json({ count, last });
    await client.close();
  } catch (error) {
    console.error('Error fetching document count:', error);
    res.status(500).json({ error: 'Error fetching last 10 documents ' });
  }
}
