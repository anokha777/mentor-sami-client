import React, { useState } from "react";
import "./Input.scss";

export default ({ type }) => {
  const [value, setValue] = useState("");

  return (
    <div className="InputWrapper">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type={type}
      />
    </div>
  );
};
