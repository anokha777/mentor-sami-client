import React, { Fragment } from "react";
import styled from "styled-components";

import { Container } from "../../components/common/Layout";
import Skeleton from "../../components/common/Skeleton";
import { Loading } from "../../components/common/Loading";
import InfiniteScroll from "../../components/common/InfiniteScroll";
import Head from "../../components/common/Head";
import PeopleCard from "./PeopleCard";
import { Query } from "react-apollo";

import { GET_USERS } from "../../graphql/User";

import { PEOPLE_PAGE_USERS_LIMIT } from "../../constants/dataLimit";

import { useStore } from "../../store";

const Root = styled(Container)`
  margin-top: ${(p) => p.theme.spacing.lg};

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    margin-left: ${(p) => p.theme.spacing.lg};
    padding: 0;
  }
`;

const PeopleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 20px;
  margin-bottom: ${(p) => p.theme.spacing.lg};
`;

/**
 * People page
 */
const People = () => {
  const [{ auth }] = useStore();
  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: PEOPLE_PAGE_USERS_LIMIT,
  };

  return (
    <Root maxWidth="md">
      <Head title="Find new People" />

      <Query
        query={GET_USERS}
        variables={variables}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, fetchMore, networkStatus }) => {
          if (loading && networkStatus === 1) {
            return (
              <PeopleContainer>
                <Skeleton height={280} count={PEOPLE_PAGE_USERS_LIMIT} />
              </PeopleContainer>
            );
          }

          const { users, count } = data.getUsers;

          if (!users.length > 0) return "No people yet.";

          return (
            <InfiniteScroll
              data={users}
              dataKey="getUsers.users"
              count={parseInt(count)}
              variables={variables}
              fetchMore={fetchMore}
            >
              {(data) => {
                const showNextLoading =
                  loading && networkStatus === 3 && count !== data.length;

                return (
                  <Fragment>
                    <PeopleContainer>
                      {data.map((user) => (
                        <PeopleCard key={user.id} user={user} />
                      ))}
                    </PeopleContainer>

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              }}
            </InfiniteScroll>
          );
        }}
      </Query>
    </Root>
  );
};

export default People;
