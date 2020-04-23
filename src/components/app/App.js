import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { GET_AUTH_USER } from "../../graphql/User/index";
import { GET_NEW_CONVERSATIONS_SUBSCRIPTION } from "../../graphql/Message/index";
import { NOTIFICATION_CREATED_OR_DELETED } from "../../graphql/Notification/index";

import Message from "../Message";
import { Loading } from "../common/Loading";
import ApplicationLayout from "../../layouts/ApplicationLayout";
import AuthenticationLayout from "../../layouts/AuthenticationLayout";

import { useStore } from "../../store";

const App = () => {
  const [{ message }] = useStore();

  const { loading, subscribeToMore, data, refetch } = useQuery(GET_AUTH_USER);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: NOTIFICATION_CREATED_OR_DELETED,
      updateQuery: async (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const oldNotifications = prev.getAuthUser.newNotifications;
        const {
          operation,
          notification,
        } = subscriptionData.data.notificationCreatedOrDeleted;

        let newNotifications;

        if (operation === "CREATE") {
          // Don't show message notification in Header if user already is on notifications page
          if (window.location.href.split("/")[3] === "notifications") {
            return prev;
          }

          // Add new notification
          newNotifications = [notification, ...oldNotifications];
        } else {
          // Remove from notifications
          const notifications = oldNotifications;
          const index = notifications.findIndex(
            (n) => n.id === notification.id
          );
          if (index > -1) {
            notifications.splice(index, 1);
          }

          newNotifications = notifications;
        }

        // Attach new notifications to authUser
        const authUser = prev.getAuthUser;
        authUser.newNotifications = newNotifications;

        return { getAuthUser: authUser };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: GET_NEW_CONVERSATIONS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const oldConversations = prev.getAuthUser.newConversations;
        const { newConversation } = subscriptionData.data;

        // Don't show message notification in Header if user already is on messages page
        if (window.location.href.split("/")[3] === "messages") {
          return prev;
        }

        // If authUser already has unseen message from that user,
        // remove old message, so we can show the new one
        const index = oldConversations.findIndex(
          (u) => u.id === newConversation.id
        );
        if (index > -1) {
          oldConversations.splice(index, 1);
        }

        // Merge conversations
        const mergeConversations = [newConversation, ...oldConversations];

        // Attach new conversation to authUser
        const authUser = prev.getAuthUser;
        authUser.newConversations = mergeConversations;

        return { getAuthUser: authUser };
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribeToMore]);

  if (loading) return <Loading top="xl" />;

  return (
    <Router>
      <Switch>
        {data && data.getAuthUser ? (
          <Route
            exact
            render={() => <ApplicationLayout authUser={data.getAuthUser} />}
          />
        ) : (
          <Route
            exact
            render={() => <AuthenticationLayout refetch={refetch} />}
          />
        )}
      </Switch>
      {message.content.text && (
        <Message
          type={message.content.type}
          autoClose={message.content.autoClose}
        >
          {message.content.text}
        </Message>
      )}
    </Router>
  );
};

export default App;