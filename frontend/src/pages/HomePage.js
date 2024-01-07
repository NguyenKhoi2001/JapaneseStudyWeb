// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import styles from "./css/HomePage.module.css"; // Assuming you create a CSS module for HomePage
import HeroSection from "../features/homepage/HeroSection";
import Footer from "../components/Footer";
import FeatureIntro from "../features/homepage/FeatureIntro";

function HomePage() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <FeatureIntro />
      <div className={styles.welcomeBanner}>
        <h1>Welcome to My Japanese Study Site</h1>
        <p>Explore the beauty of the Japanese language and culture.</p>
      </div>
      <div className={styles.aboutSection}>
        <h2>About Us</h2>
        <p>Learn more about our courses and teaching methods.</p>
        {/* Add more content as needed */}
      </div>
      {/* Add other sections like featured courses, testimonials, etc. */}
      <footer className={styles.footer}>
        <p>© 2023 KK Japanese Studies. All rights reserved.</p>
      </footer>
      <Footer />
    </div>
  );
}

export default HomePage;
