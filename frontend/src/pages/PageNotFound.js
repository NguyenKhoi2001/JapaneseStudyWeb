import React from "react";
import styles from "./css/PageNotFound.module.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const PageNotFound = () => {
  return (
    <>
      <NavBar />
      <section className={styles.page_404}>
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className={styles.four_zero_four_bg}>
                  <h1 className="text-center ">404</h1>
                </div>

                <div className={styles.contant_box_404}>
                  <h3 className="h2">Look like you're lost</h3>

                  <p>the page you are looking for not available!</p>

                  <a href="/" className={styles.link_404}>
                    Go to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PageNotFound;
