import React, { useState, useEffect } from "react";
import CardFlipable from "./CardFlipable";
import CardNonFlipable from "./CardNonFlipable";
import styles from "./CardSlider.module.css";

const slidesData = [
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=497",
    vocabulary: "Apple",
    kanji: "りんご",
    exampleSentence: "I ate an apple.",
    meaning: "Fruit",
    sinoSound: "Ringo",
  },
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=291",
    vocabulary: "Book",
    kanji: "本",
    exampleSentence: "This is a book.",
    meaning: "Object for reading",
    sinoSound: "Hon",
  },
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=786",
    vocabulary: "Cat",
    kanji: "猫",
    exampleSentence: "The cat is sleeping.",
    meaning: "Domestic animal",
    sinoSound: "Neko",
  },
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=768",
    vocabulary: "Sun",
    kanji: "太陽",
    exampleSentence: "The sun is shining.",
    meaning: "Star at the center of the solar system",
    sinoSound: "Taiyō",
  },
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=726",
    vocabulary: "Water",
    kanji: "水",
    exampleSentence: "Please give me some water.",
    meaning: "Liquid H2O",
    sinoSound: "Mizu",
  },
  {
    imageUrl: "https://unsplash.it/1900/1024/?image=821",
    vocabulary: "Friend",
    kanji: "友達",
    exampleSentence: "He is my friend.",
    meaning: "Companion",
    sinoSound: "Tomodachi",
  },
];

const CardSlider = () => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [isFlipable, setIsFlipable] = useState(true); // State to toggle between flipable and non-flipable cards
  const max = slidesData.length;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setActive((current) => (current === max - 1 ? 0 : current + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoplay, max]);

  const handlePrev = () => {
    setActive(active > 0 ? active - 1 : max - 1);
  };

  const handleNext = () => {
    setActive(active < max - 1 ? active + 1 : 0);
  };

  const toggleAutoplay = () => setAutoplay(!autoplay);

  const toggleCardType = () => setIsFlipable(!isFlipable); // Function to toggle the card type

  return (
    <>
      <div className={styles.sliderContainer}>
        <div className={styles.buttonDiv}>
          {active !== 0 && (
            <button className={styles.prevButton} onClick={handlePrev}>
              Prev
            </button>
          )}
        </div>
        <div className={styles.slider}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slidesData.map((slide, index) => (
              <div key={index} className={styles.slide}>
                {isFlipable ? (
                  <CardFlipable {...slide} />
                ) : (
                  <CardNonFlipable {...slide} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonDiv}>
          {active !== max - 1 && (
            <button className={styles.nextButton} onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      </div>{" "}
      <div className={styles.controls}>
        <button onClick={toggleAutoplay}>{autoplay ? "Stop" : "Start"}</button>
        <button onClick={toggleCardType}>
          {isFlipable ? "Use Non-Flipable Card" : "Use Flipable Card"}
        </button>{" "}
        {/* Toggle Button */}
      </div>
    </>
  );
};

export default CardSlider;
