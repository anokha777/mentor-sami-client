import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Icon } from "./Icon";

const Root = styled.div`
  width: ${(p) => (p.size ? `${p.size}px` : "30px")};
  height: ${(p) => (p.size ? `${p.size}px` : "30px")};
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/**
 * Component for rendering user's image
 */
const UserImage = ({ size, image }) => (
  <Root size={size}>
    {image ? (
      <Image src={image} />
    ) : (
      <Icon icon="user" className="" size={size} />
    )}
  </Root>
);

UserImage.propTypes = {
  size: PropTypes.number,
  image: PropTypes.string,
};

export default UserImage;
