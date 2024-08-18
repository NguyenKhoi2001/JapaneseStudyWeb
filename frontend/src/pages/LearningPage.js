import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Timeline from "../features/learning/hompage/Timeline";
// import BasicContainer from "../features/learning/basic/BasicContainer";

import styles from "./css/LearningPage.module.css";

function LearningPage() {
  return (
    <div className={styles.learningPageContainer} id="modal-root">
      <NavBar />
      <Timeline />
      <Footer />
    </div>
  );
}

export default LearningPage;
