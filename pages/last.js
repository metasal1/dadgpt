import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react';
export default function Home() {

  const [count, setCount] = useState(0);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocumentCount = async () => {
      try {
        const response = await fetch("/api/last"); // Replace with your server endpoint
        const json = await response.json();
        setCount(json.count);
        setDocuments(json.last);

      } catch (error) {
        console.error("Error fetching document count:", error);
      }
    };

    fetchDocumentCount();
  }, []);
  return (
    <div className={styles.container} >
      <h1>Last 20 Questions and Answers</h1>
      {count}
      {documents.map((document) => (
        <div key={document.id}>
          <h2>{document.question}</h2>
          <p>{document.answer}</p>
        </div>
      ))}

      <Analytics />
    </div >
  )
}
