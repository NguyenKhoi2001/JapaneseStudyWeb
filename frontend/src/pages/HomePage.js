// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../features/homepage/HeroSection";
import Footer from "../components/Footer";
import FeatureIntro from "../features/homepage/FeatureIntro";
import InfographicRoadmap from "../features/homepage/InfographicRoadmap";
import CourseSwiper from "../features/homepage/CourseSwiper";
// import TestTranslate from "../features/test/TestTranslate";

function HomePage() {
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
