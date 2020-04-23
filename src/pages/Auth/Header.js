import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as Routes from "../../routes/index";

import { Container } from "../../components/common/Layout";
import { Anchor } from "../../components/common/Text";
import SignIn from "./SignIn";

const Root = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 80px;
  background-color: transparent;
`;

const StyledContainer = styled(Container)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 ${(p) => p.theme.spacing.sm};
  @media (min-width: ${(p) => p.theme.screen.md}) {
    justify-content: space-between;
  }
`;

const Logo = styled(Anchor)`
  display: none;
  color: ${(p) => p.theme.colors.white};
  font-size: ${(p) => p.theme.font.size.sm};
  font-weight: ${(p) => p.theme.font.weight.bold};
  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
  @media (min-width: ${(p) => p.theme.screen.md}) {
    display: block;
  }
`;

const SignInContainer = styled.div`
  width: 600px;
`;

/**
 * Header of the App when user isn't authenticated
 */
const Header = ({ refetch }) => {
  return (
    <Root>
      <StyledContainer maxWidth="lg">
        <Logo to={Routes.HOME}>{process.env.REACT_APP_SITE_NAME}</Logo>

        <SignInContainer>
          <SignIn refetch={refetch} />
        </SignInContainer>
      </StyledContainer>
    </Root>
  );
};

Header.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default Header;
