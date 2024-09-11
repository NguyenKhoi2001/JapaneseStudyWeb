// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PronunciationContainer from "../features/pronunciation/PronunciationContainer";

function PronunciationPage() {
  return (
    <div>
      <NavBar />
      <PronunciationContainer />
      <Footer />
    </div>
  );
}

export default PronunciationPage;
