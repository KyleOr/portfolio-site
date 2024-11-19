// pages/index.tsx
import React, { useState } from "react";
import TopNav from "@/components/TopNav";
import LoadingScreen from "@/components/LoadingScreen";
import styles from "../../styles/homepage.module.css";
import ThreeBackground from "@/components/ThreeBackground";

const Home: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      {isLoaded && (
        <div className={styles.container}>
          <ThreeBackground />
          <TopNav />
          <main className={styles.mainContent}>
            <h1 className={styles.bigtitle}>KYLE ORIS</h1>
            <p className={styles.title}>
              SOFTWARE DEVELOPER AND DESIGNER PORTFOLIO
            </p>
          </main>
        </div>
      )}
    </>
  );
};

export default Home;
