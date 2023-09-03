import { useEffect, useState } from "react";
import styles from "../styles/ChromeDetection.module.css";

const ChromeDetection = () => {
  const [isChrome, setIsChrome] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setIsChrome(userAgent.includes("Chrome"));
    setIsIOSDevice(userAgent.includes("iPhone") || userAgent.includes("iPad"));
    // Clean up the event listener when the component unmounts
    return () => {
      // Perform any necessary cleanup here
    };
  }, []);

  if (isChrome && isIOSDevice) {
    return (
      <div className={styles.banner}>
        <p>Please consider using Safari on iOS for the best experience.</p>
      </div>
    );
  }

  // Render your regular content if not using Chrome
  return <div>{/* Your regular content goes here */}</div>;
};

export default ChromeDetection;
