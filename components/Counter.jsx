import React, { useState, useEffect } from "react";
import styles from "../styles/Counter.module.css";
const DocumentCount = () => {
  const [count, setCount] = useState();

  const [browser, setBrowser] = useState(null);
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setBrowser(userAgent);
  }, []);

  useEffect(() => {
    const fetchDocumentCount = async () => {
      try {
        const response = await fetch("/api/counter"); // Replace with your server endpoint
        const json = await response.json();
        setCount(json.count);
      } catch (error) {
        console.error("Error fetching document count:", error);
      }
    };

    fetchDocumentCount();
  }, []);

  return (
    <div className={styles.footer}>
      {!count && (
        <div className={styles.skeletonLoader}>
          <div className={styles.skeletonBlock}></div>
        </div>
      )}
      {count && <div>DadGPT has answered {count} questions so far</div>}
      <div>
        <a href="https://metasal.vercel.app" target="_blank">
          Copyright 2023 ©️ Salim Karim
        </a>
      </div>
      <div className={styles.browser}>{browser}</div>
    </div>
  );
};

export default DocumentCount;
