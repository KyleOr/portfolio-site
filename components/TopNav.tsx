import React from "react";
import styles from "../styles/TopNav.module.css";
import Link from "next/link";

const TopNav: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>KO</div>
      <ul className={styles.navLinks}>
        <li>
          <a href="#current">JOURNAL</a>
        </li>
        <li>
          <a href="#case-studies">CASE STUDIES</a>
        </li>
        <li>
          <a href="#projects">PROJECTS</a>
        </li>
        <li>
          <a href="#contacts">ACADEMICS</a>
        </li>
      </ul>
      <div className={styles.contactButton}>
        <a href="#contact">CONTACT</a>
      </div>
    </nav>
  );
};

export default TopNav;
