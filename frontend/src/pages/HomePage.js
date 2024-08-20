// HomePage.js
import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../features/homepage/HeroSection";
import Footer from "../components/Footer";
import FeatureIntro from "../features/homepage/FeatureIntro";
import InfographicRoadmap from "../features/homepage/InfographicRoadmap";
import CourseSwiper from "../features/homepage/CourseSwiper";
import { apiUrl } from "../services/api.config";
// import TestTranslate from "../features/test/TestTranslate";

function HomePage() {
  useEffect(() => {
    // Function to ping the server
    const pingServer = async () => {
      try {
        const response = await fetch(`${apiUrl}/`);
        const text = await response.text();
        console.log("Server Response: ", text); // Should print "Hello World!"
      } catch (error) {
        console.error("Failed to ping the server:", error);
      }
    };
    pingServer();
    const intervalId = setInterval(pingServer, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <NavBar />
      <HeroSection />
      <FeatureIntro />
      <InfographicRoadmap />
      <CourseSwiper />
      <Footer />
    </div>
  );
}

export default HomePage;
