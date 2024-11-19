// components/LoadingScreen.tsx
import React, { useEffect, useState } from "react";
import styles from "../styles/LoadingScreen.module.css";

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          setTimeout(onComplete, 3000); // Adjust to allow all layers to slide
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  const digits = String(progress).padStart(3, "0").split("");

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.loadingScreen} ${isReady ? styles.slideDown : ""}`}
      >
        <div className={styles.counter}>
          {digits.map((digit, index) => (
            <div key={index} className={styles.digitSlot}>
              <span className={styles.digit}>{digit}</span>
            </div>
          ))}
          <span className={styles.percentSign}>%</span>
        </div>
      </div>
      <div
        className={`${styles.secondaryLayer} ${
          isReady ? styles.slideDownCascade1 : ""
        }`}
      />
      <div
        className={`${styles.thirdLayer} ${
          isReady ? styles.slideDownCascade2 : ""
        }`}
      />
      <div
        className={`${styles.fourthLayer} ${
          isReady ? styles.slideDownCascade3 : ""
        }`}
      />
    </div>
  );
};

export default LoadingScreen;
