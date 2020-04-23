import React from "react";
import classNames from "../../../utils/class-names";
import "./Button.scss";

const Button = (props) => {
  const { primary, secondary, className, onClick, onBlur, buttonText } = props;

  const classes = classNames(className, {
    ["Button--primary"]: primary && !secondary,
    ["Button--secondary"]: !primary && secondary,
  });

  const onClickHandler = (e) => {
    onClick(e);
  };

  const onBlurHandler = (e) => {
    onBlur(e);
  };

  return (
    <button
      className={`${classes}`}
      onClick={onClickHandler}
      onBlur={onBlurHandler}
    >
      {buttonText}
    </button>
  );
};

export default Button;
