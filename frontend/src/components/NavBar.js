// NavBar.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./css/NavBar.module.css";

function NavBar() {
  return (
    <nav className={styles.navBar}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>KK</div>
        <div className={styles.logoSubText}>
          <p>TDT </p>
          <p>University</p>
        </div>
      </div>
      <ul className={styles.navList}>
        <li>
          <Link to="/gioi-thieu" className={styles.navItem}>
            Giới thiệu
          </Link>
        </li>
        <li>
          <Link to="/blog" className={styles.navItem}>
            Blog
          </Link>
        </li>
        <li>
          <Link to="/hoc-cung-kk" className={styles.navItem}>
            Học cùng KK
          </Link>
        </li>
        <li>
          <Link to="/luyen-phat-am" className={styles.navItem}>
            Luyện phát âm
          </Link>
        </li>
        <li>
          <Link to="/dang-nhap" className={styles.navItem}>
            Đăng nhập
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
