import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Mutation } from "react-apollo";

import { Spacing, Container } from "../../components/common/Layout";
import { H1, H3, Error } from "../../components/common/Text";
import { InputText, SecondaryButton } from "../../components/common/Form";
import Head from "../../components/common/Head";

import { emailRegex, usernameRegex } from "../../constants/regex";

import { SIGN_UP } from "../../graphql/User/index";

import * as Routes from "../../routes/index";

const Root = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    justify-content: space-between;
    margin-top: 120px;
  }
`;

const Form = styled.div`
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radius.sm};
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 450px;
  }
`;

/**
 * Sign Up page
 */
const SignUp = ({ history, refetch }) => {
  const [error, setError] = useState("");
  const [values, setValues] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validate = () => {
    if (!fullName || !email || !username || !password) {
      return "All fields are required";
    }

    if (fullName.length > 50) {
      return "Full name no more than 50 characters";
    }

    if (!emailRegex.test(String(email).toLowerCase())) {
      return "Enter a valid email address.";
    }

    if (!usernameRegex.test(username)) {
      return "Usernames can only use letters, numbers, underscores and periods";
    } else if (username.length > 20) {
      return "Username no more than 50 characters";
    }

    if (password.length < 6) {
      return "Password min 6 characters";
    }

    return false;
  };

  const handleSubmit = (e, signup) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setError(error);
      return false;
    }

    signup().then(async ({ data }) => {
      localStorage.setItem("token", data.signup.token);
      await refetch();
      history.push(Routes.HOME);
    });
  };

  const renderErrors = (apiError) => {
    let errorMessage;

    if (error) {
      errorMessage = error;
    } else if (apiError) {
      errorMessage =
        apiError &&
        apiError.graphQLErrors[0] &&
        apiError.graphQLErrors[0].message;
    }

    if (errorMessage) {
      return (
        <Spacing bottom="sm" top="sm">
          <Error>{errorMessage}</Error>
        </Spacing>
      );
    }

    return null;
  };

  const { fullName, email, password, username } = values;

  return (
    <Mutation
      mutation={SIGN_UP}
      variables={{ input: { fullName, email, password, username } }}
    >
      {(signup, { loading, error: apiError }) => {
        return (
          <Root maxWidth="lg">
            <Head />
            <Form>
              <Spacing bottom="md">
                <H1>Create an Account</H1>
                <H3>Its quick and easy</H3>
              </Spacing>

              <form onSubmit={(e) => handleSubmit(e, signup)}>
                <InputText
                  type="text"
                  name="fullName"
                  values={fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  borderColor="white"
                />
                <Spacing top="xs" bottom="xs">
                  <InputText
                    type="text"
                    name="email"
                    values={email}
                    onChange={handleChange}
                    placeholder="Email"
                    borderColor="white"
                  />
                </Spacing>
                <InputText
                  type="text"
                  name="username"
                  values={username}
                  onChange={handleChange}
                  placeholder="Username"
                  borderColor="white"
                />
                <Spacing top="xs" bottom="xs">
                  <InputText
                    type="password"
                    name="password"
                    values={password}
                    onChange={handleChange}
                    placeholder="Password"
                    borderColor="white"
                  />
                </Spacing>

                {renderErrors(apiError)}

                <Spacing top="sm" />
                <SecondaryButton size="large" disabled={loading}>
                  Sign up
                </SecondaryButton>
              </form>
            </Form>
          </Root>
        );
      }}
    </Mutation>
  );
};

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignUp);
