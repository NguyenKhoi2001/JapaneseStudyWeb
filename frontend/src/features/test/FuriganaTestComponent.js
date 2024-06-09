import React from "react";
import Furigana from "../../components/Furigana"; // Assuming Furigana is in a separate file

const FuriganaTestComponent = () => {
  return (
    <div>
      <h1>Furigana Test</h1>
      <Furigana baseText="彼女は美しい庭で花を楽しんでいます。" />
      <Furigana baseText="重要" />
      <Furigana baseText="学習" />
      <Furigana baseText="富士山は日本一の山です。" />
      <Furigana baseText="猫が好きです。" />
      <Furigana baseText="日本語を勉強しています。" />
      <Furigana baseText="漢字の読み方を学ぶ。" />
    </div>
  );
};

export default FuriganaTestComponent;
