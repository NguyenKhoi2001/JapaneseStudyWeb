// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../features/homepage/HeroSection";
import Footer from "../components/Footer";
import FeatureIntro from "../features/homepage/FeatureIntro";
import InfographicRoadmap from "../features/homepage/InfographicRoadmap";
import CourseSwiper from "../features/homepage/CourseSwiper";
import CardSlider from "../features/test/CardSlider";
import TestQuill from "../features/test/TestQuill";
// import TestTranslate from "../features/test/TestTranslate";

function HomePage() {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <TestQuill />
      {/* <TestTranslate /> */}
      <CardSlider />
      <FeatureIntro />
      <InfographicRoadmap />
      <CourseSwiper />
      <Footer />
    </div>
  );
}

export default HomePage;
