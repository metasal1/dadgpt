import { useEffect, useState } from "react";
import styles from "../styles/ChromeDetection.module.css";

const ChromeDetection = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isChromeMobile, setIsChromeMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [useragent, setUseragent] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setUseragent(userAgent);
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("iphone")) {
      setIsIos(true);
    }
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("crios")) {
      setIsChromeMobile(true);
    }
  }, []);

  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      console.log("You are on a mobile device.");
      setIsDesktop(false);
    } else {
      console.log("You are on a desktop device.");
      setIsDesktop(true);
    }
  }, []);

  if (isChromeMobile && isIos) {
    return (
      <div className={styles.banner}>
        <p>
          Please use Safari browser
          <br /> Mobile app 📱 coming soon!
        </p>
      </div>
    );
  }
  if (!isDesktop) {
    return (
      <div className={styles.banner}>
        <p>
          💻 Please use a laptop or computer for best experience 🖥️
          <br />
          📱 Mobile app coming soon!
        </p>
      </div>
    );
  }

  // Render your regular content if not using Chrome
  return <div>{/* Your regular content goes here */}</div>;
};

export default ChromeDetection;
