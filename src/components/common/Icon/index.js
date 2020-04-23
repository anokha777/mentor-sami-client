import React from "react";
import PropTypes from "prop-types";
//import "svgxuse";
import classNames from "../../../utils/class-names";
import SVGSTORE_PATH from "../../../utils/svgstore-path";
import iconSizes from "../../../styles/mixins/_icon.scss";
import "./icon.scss";

const DEFAULT_ICON_SIZE = "sm";
const iconPrefix = "icon-";
const DEFAULT_FILL = "#676869";

const allowedSizes = Object.keys(iconSizes)
  .filter((size) => size.startsWith(iconPrefix))
  .map((size) => size.replace(iconPrefix, ""));

export const Icon = ({ className, icon, style, size, fillcolor }) => {
  if (!allowedSizes.includes(size)) {
    size = DEFAULT_ICON_SIZE;
  }

  const iconClassName = classNames(Icon.displayName, className, {
    [`${Icon.displayName}--size-${size}`]: allowedSizes.includes(size),
  });

  return (
    <svg
      className={`${iconClassName}`}
      name={`icon-${icon}`}
      fill={fillcolor || DEFAULT_FILL}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      focusable={false}
      style={style}
    >
      <use xlinkHref={`${SVGSTORE_PATH}#${icon}`} />
    </svg>
  );
};

Icon.displayName = "Icon";

Icon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  style: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes),
  fillcolor: PropTypes.string,
};

Icon.defaultProps = {
  className: "",
  style: {},
  size: "sm",
  fillcolor: "",
};
