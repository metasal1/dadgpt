import { useEffect, useState } from "react";
import styles from "../styles/ChromeDetection.module.css";

const ChromeDetection = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      console.log("You are on a mobile device.");
      setIsDesktop(false);
    } else {
      console.log("You are on a desktop device.");
      setIsDesktop(true);
    }
  }, []);

  if (!isDesktop) {
    return (
      <div className={styles.banner}>
        <p>
          Please use a laptop 💻 or computer 🖥️ at the moment.
          <br /> Mobile app 📱 coming soon!
        </p>
      </div>
    );
  }

  // Render your regular content if not using Chrome
  return <div>{/* Your regular content goes here */}</div>;
};

export default ChromeDetection;
