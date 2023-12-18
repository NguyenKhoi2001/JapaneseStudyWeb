// HomePage.js
import React from "react";
import NavBar from "../components/NavBar";
import styles from "./css/HomePage.module.css"; // Assuming you create a CSS module for HomePage
import HeroImage from "../assets/images/HeroImage.png";

function HomePage() {
  return (
    <div>
      <NavBar />

      <div className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>
            Chào mừng bạn đến với KK - Trang web học tiếng Nhật của Lê Duy Khánh
            và Nguyễn Đình Minh Khôi!
          </h1>
          <ul className={styles.heroHighlights}>
            <li>
              Tự tin học tiếng Nhật: Học cùng chúng tôi để nắm vững kiến thức và
              phát triển kỹ năng tiếng Nhật.
            </li>
            <li>
              Học tương tác qua Zoom: Tham gia các buổi học trực tuyến với giảng
              viên và bạn học.
            </li>
            <li>
              Học mọi lúc, mọi nơi: Sử dụng ứng dụng KK Online trên mọi thiết
              bị.
            </li>
            <li>
              Chương trình đa dạng: Đối tượng học từ người mới đến người có kinh
              nghiệm, luyện phát âm, ôn tập, và nhiều khóa học khác.
            </li>
            <li>
              Chứng chỉ JLPT và đỗ sau khi học xong: Cam kết giúp bạn đỗ chứng
              chỉ JLPT và hỗ trợ miễn phí nếu gặp khó khăn.
            </li>
            <li>
              Giáo viên có kinh nghiệm: Đội ngũ giáo viên với chứng chỉ N2 và sự
              minh bạch trong quá trình học.
            </li>
          </ul>
          <p>
            Hãy tham gia KK để khám phá tiếng Nhật một cách dễ dàng và hiệu quả!
          </p>
        </div>

        <div className={styles.heroImageContainer}>
          <img src={HeroImage} alt="Hero" className={styles.heroImage} />
        </div>
      </div>

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
    </div>
  );
}

export default HomePage;
