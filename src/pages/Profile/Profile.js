import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import styled from "styled-components";

import Head from "../../components/common/Head";
import Skeleton from "../../components/common/Skeleton";
import { Container, Spacing } from "../../components/common/Layout";
import ProfileInfo from "./ProfileInfo";
import CreatePost from "../../components/CreatePost";
import ProfilePosts from "./ProfilePosts";

import { GET_USER } from "../../graphql/User";

import { useStore } from "../../store";

const Root = styled.div`
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    margin-left: ${(p) => p.theme.spacing.lg};
    padding: 0;
  }
`;

/**
 * User Profile Page
 */
const Profile = ({ match }) => {
  const [{ auth }] = useStore();
  const { username } = match.params;

  return (
    <Root>
      <Head title={username} />

      <Query query={GET_USER} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <Container padding="xxs">
                <Skeleton height={350} />
                <Container maxWidth="sm">
                  <Spacing top="lg" bottom="lg">
                    <Skeleton height={82} />
                  </Spacing>
                </Container>
              </Container>
            );
          }

          if (error || !data.getUser) return "Not Found";

          return (
            <Container padding="xxs">
              <ProfileInfo user={data.getUser} />

              <Container maxWidth="sm">
                <Spacing top="lg" bottom="lg">
                  {username === auth.user.username && <CreatePost />}
                </Spacing>

                <ProfilePosts username={username} />
              </Container>
            </Container>
          );
        }}
      </Query>
    </Root>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
