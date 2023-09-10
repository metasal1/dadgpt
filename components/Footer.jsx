import React, { useState, useEffect } from "react";
import styles from "../styles/Counter.module.css";
import xLogo from "../public/x.svg";
import Image from "next/image";
import Stores from "./Stores";
const DocumentCount = (props) => {
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
      <Stores />
      <a
        style={{ padding: 20 }}
        href="https://x.com/DadGippity"
        target="_blank"
        className="x"
      >
        <Image src={xLogo} width={20} height={20} alt="Twitter X logo" />
      </a>
      {!count && (
        <div className={styles.skeletonLoader}>
          <div className={styles.skeletonBlock}></div>
        </div>
      )}
      {count && <div>DadGippity has answered {count} questions so far</div>}
      <div>
        <a href="https://metasal.vercel.app" target="_blank">
          Copyright 2023 © Salim Karim | {props.imgId || "null"}
        </a>
      </div>
      <div className={styles.browser}>{browser}</div>
    </div>
  );
};

export default DocumentCount;
