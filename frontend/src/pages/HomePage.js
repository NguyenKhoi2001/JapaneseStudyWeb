// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import HeroSection from "../features/homepage/HeroSection";
import Footer from "../components/Footer";
import FeatureIntro from "../features/homepage/FeatureIntro";
import InfographicRoadmap from "../features/homepage/InfographicRoadmap";
import CourseSwiper from "../features/homepage/CourseSwiper";

// Custom hook for loading an external script
// const useScript = (url, attributes = {}) => {
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = url;
//     Object.entries(attributes).forEach(([key, value]) => {
//       script.setAttribute(key, value);
//     });
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [url, attributes]);
// };

function HomePage() {
  // Using the custom hook to load the external script
  // useScript("https://kamimind.ai/kami-chat-widget.js", {
  //   id: "kami-chat-widget",
  //   token: "CVFdthl1N0qz3SPnErrOJtHiFRk9NTzS",
  //   charset: "utf-8",
  //   botToken: "ad0b13be-27d3-4121-b3cf-85e7dcbb023a",
  //   defer: "",
  // });

  // console.log(test);
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
