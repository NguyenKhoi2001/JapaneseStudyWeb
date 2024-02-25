import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import CourseItem from "./CourseItem";
import "./css/CourseSwiper.css";
import { useTranslation } from "react-i18next";

const CourseSwiper = () => {
  const { t } = useTranslation();
  const levels = ["basic", "N5", "N4", "N3", "N2", "N1"];

  return (
    <div className="container">
      <div className="jlpt-heading">{t("jlptJourney.title")}</div>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        spaceBetween={30}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper-container"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },

          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },

          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
        }}
      >
        {levels.map((levelKey, index) => (
          <SwiperSlide key={index}>
            <CourseItem levelKey={`jlptJourney.levels.${levelKey}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CourseSwiper;
