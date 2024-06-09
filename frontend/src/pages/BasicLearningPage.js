import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import BasicContainer from "../features/learning/basic/BasicContainer";

import styles from "./css/LearningPage.module.css";

function BasicLearningPage() {
  return (
    <div className={styles.learningPageContainer} id="modal-root">
      <NavBar />
      <BasicContainer />
      <Footer />
    </div>
  );
}

export default BasicLearningPage;
