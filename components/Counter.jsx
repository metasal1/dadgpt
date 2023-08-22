import React, { useState, useEffect } from "react";
import styles from "../styles/Counter.module.css";
const DocumentCount = () => {
  const [count, setCount] = useState();

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
      {count && <i>DadGPT has answered {count} questions so far</i>}
      <a href="https://metasal.vercel.app" target="_blank">
        Copyright 2023 ©️ | Salim Karim
      </a>
    </div>
  );
};

export default DocumentCount;
