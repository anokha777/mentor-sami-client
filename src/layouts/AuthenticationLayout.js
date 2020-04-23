import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import {
  Header,
  SignUp,
  ForgetPassword,
  ResetPassword,
} from "../pages/Auth/index";

import { HOME, FORGET_PASSWORD, RESET_PASSWORD } from "../routes/index";

import { Overlay } from "../components/common/Layout";

import bgImage from "../static/images/auth-bg.jpg";

const Root = styled.div`
  background: url(${bgImage}) no-repeat top / cover;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: ${(p) => p.theme.zIndex.lg};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    justify-content: center;
  }
`;

const Pages = styled.div`
  margin-top: 80px;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    margin-top: -120px;
  }
`;

/**
 * Main Layout for the app, when user isn't authenticated
 */
const AuthenticationLayout = ({ refetch }) => {
  return (
    <Root>
      <Overlay transparency="0.5" />

      <Container>
        <Header refetch={refetch} />

        <Pages>
          <Switch>
            <Route
              exact
              path={HOME}
              render={() => <SignUp refetch={refetch} />}
            />
            <Route exact path={FORGET_PASSWORD} component={ForgetPassword} />
            <Route
              exact
              path={RESET_PASSWORD}
              render={() => <ResetPassword refetch={refetch} />}
            />
            <Redirect to={HOME} />
          </Switch>
        </Pages>
      </Container>
    </Root>
  );
};

AuthenticationLayout.propTypes = {
  refetch: PropTypes.func.isRequired,
};

export default AuthenticationLayout;
