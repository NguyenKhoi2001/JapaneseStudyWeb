import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useImperativeHandle,
  forwardRef,
} from "react";

import "../../components/css/SvgStyles.css";

const lazyLoadKanjiSvg = (kanjiUnicode) => {
  if (kanjiUnicode == null) return null;
  return lazy(() =>
    import(`../../assets/kanjiConverted/Svg${kanjiUnicode}.jsx`)
  );
};
const KanjiAnimation = forwardRef(({ kanjiUnicode, className }, ref) => {
  const [SvgComponent, setSvgComponent] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const SvgComponentLazy = lazyLoadKanjiSvg(kanjiUnicode);
    setSvgComponent(() => SvgComponentLazy);
  }, [kanjiUnicode]);

  useImperativeHandle(ref, () => ({
    startAnimation,
  }));
  const startAnimation = () => {
    setAnimationKey((prevKey) => prevKey + 1);

    setTimeout(() => {
      const paths = document.querySelectorAll(
        `#StrokePaths_${kanjiUnicode} path`
      );
      const strokeNumbers = document.querySelectorAll(
        `#StrokeNumbers_${kanjiUnicode} text`
      );

      strokeNumbers.forEach((number) => {
        number.style.opacity = 0;
      });

      paths.forEach((path, index) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = "none";

        setTimeout(() => {
          path.style.transition = "stroke-dashoffset 1s ease-in-out";
          path.style.strokeDashoffset = "0";
          if (strokeNumbers[index]) {
            strokeNumbers[index].style.opacity = 1;
            strokeNumbers[index].style.transition = "opacity 1s ease-in-out";
          }
        }, index * 800);
      });
    }, 50);
  };
  return (
    <div className={className}>
      <Suspense fallback={<div>Loading...</div>}>
        {SvgComponent && <SvgComponent key={animationKey} />}
      </Suspense>
    </div>
  );
});

export default KanjiAnimation;
