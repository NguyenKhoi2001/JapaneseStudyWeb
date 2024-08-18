import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const CustomImage = ({
  src,
  alt,
  style,
  className,
  translationFilename = "",
}) => {
  const { t } = useTranslation(translationFilename);
  const defaultImage = "https://via.placeholder.com/200?text=No+Image";

  return (
    <img
      src={src || defaultImage}
      alt={
        alt ||
        t("advancedLearning.vocabulary.vocabularyCardFlipable.vocabulary")
      }
      style={style}
      className={className}
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
};

CustomImage.defaultProps = {
  src: "",
  alt: "",
  style: {},
  className: "",
};

export default CustomImage;
