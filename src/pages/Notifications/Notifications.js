import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";

import { Container, Content } from "../../components/common/Layout";
import { Loading } from "../../components/common/Loading";
import Skeleton from "../../components/common/Skeleton";
import Notification from "../../components/app/Notification";
import InfiniteScroll from "../../components/common/InfiniteScroll";
import Head from "../../components/common/Head";

import { useStore } from "../../store";

import { GET_USER_NOTIFICATION } from "../../graphql/Notification";

import { NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT } from "../../constants/dataLimit";

const Root = styled(Container)`
  margin-top: ${(p) => p.theme.spacing.lg};
`;

const List = styled.div`
  overflow: hidden;
  border-radius: ${(p) => p.theme.radius.sm};
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

/**
 * Notifications page
 */
const Notifications = () => {
  const [{ auth }] = useStore();

  const variables = {
    userId: auth.user.id,
    skip: 0,
    limit: NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT,
  };

  return (
    <Content>
      <Root maxWidth="md">
        <Head title={`${auth.user.username}'s Notifications`} />

        <Query
          query={GET_USER_NOTIFICATION}
          variables={variables}
          notifyOnNetworkStatusChange
        >
          {({ data, loading, fetchMore, networkStatus }) => {
            if (loading && networkStatus === 1) {
              return (
                <Skeleton
                  height={56}
                  bottom="xxs"
                  count={NOTIFICATIONS_PAGE_NOTIFICATION_LIMIT}
                />
              );
            }

            const { notifications, count } = data.getUserNotifications;

            if (!notifications.length) {
              return "no notification yet";
            }

            return (
              <InfiniteScroll
                data={notifications}
                dataKey="getUserNotifications.notifications"
                count={parseInt(count)}
                variables={variables}
                fetchMore={fetchMore}
              >
                {(data) => {
                  const showNextLoading =
                    loading && networkStatus === 3 && count !== data.length;

                  return (
                    <>
                      <List>
                        {data.map((notification) => (
                          <Notification
                            key={notification.id}
                            notification={notification}
                            close={() => false}
                          />
                        ))}
                      </List>

                      {showNextLoading && <Loading top="lg" />}
                    </>
                  );
                }}
              </InfiniteScroll>
            );
          }}
        </Query>
      </Root>
    </Content>
  );
};

export default Notifications;
