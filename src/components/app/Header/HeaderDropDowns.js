import React from "react";
import PropTypes from "prop-types";

import HeaderUserDropDown from "./HeaderUserDropDown";
import HeaderNotificationDropDown from "./HeaderNotificationDropDown";
import HeaderMessageDropDown from "./HeaderMessageDropDown";

/**
 * Component that renders DropDown's of Header
 */
const HeaderDropDowns = ({
  messageRef,
  notificationRef,
  userRef,
  dropdownOpen,
  dropdownData,
  closeDropDown,
}) => {
  const DropDowns = {
    USER: <HeaderUserDropDown userRef={userRef} />,
    NOTIFICATION: (
      <HeaderNotificationDropDown
        notificationRef={notificationRef}
        dropdownData={dropdownData}
        closeDropDown={closeDropDown}
      />
    ),
    MESSAGE: (
      <HeaderMessageDropDown
        messageRef={messageRef}
        dropdownData={dropdownData}
      />
    ),
  };

  return dropdownOpen ? DropDowns[dropdownOpen] : null;
};

HeaderDropDowns.propTypes = {
  messageRef: PropTypes.object,
  notificationRef: PropTypes.object,
  userRef: PropTypes.object,
  dropdownOpen: PropTypes.string,
  dropdownData: PropTypes.array,
  closeDropDown: PropTypes.func,
};

export default HeaderDropDowns;
