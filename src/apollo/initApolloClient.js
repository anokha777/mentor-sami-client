import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, Observable, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from "apollo-utilities";

let apolloCLient = null;

const createDefaultCache = () => new InMemoryCache();

const createAuthenticationLink = () => {
  const request = (operation) => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  };

  return new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );
};

/**
 * Helper functions that handles error cases
 */
const handleErrors = () => {
  return onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      console.log("graphQLErrors", graphQLErrors);
    }
    if (networkError) {
      console.log("networkError", networkError);
    }
  });
};

const createApolloClient = (apolloConfig) => {
  const { authLink, uploadLink, wsLink } = apolloConfig;
  const cache = createDefaultCache();
  const errorLink = handleErrors();
  wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () =>
    wsLink.subscriptionClient.maxConnectTimeGenerator.max;
  const terminatingLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    uploadLink
  );

  const config = {
    cache,
    link: ApolloLink.from([errorLink, authLink, terminatingLink]),
  };

  return new ApolloClient(config);
};

export default (serverUrl) => {
  const serverWebSoketUrl =
    serverUrl &&
    serverUrl.replace("https://", "ws://").replace("http://", "ws://");
  const authLink = createAuthenticationLink();
  const uploadLink = createUploadLink({ uri: serverUrl });

  const token = localStorage.getItem("token") || "";
  const wsLink = new WebSocketLink({
    uri: serverWebSoketUrl,
    options: {
      timeout: process.env.REACT_APP_WEBSOCKET_TIMEOUT,
      reconnect: true,
      connectionParams: {
        authorization: token,
      },
    },
  });

  const apolloConfig = {
    authLink,
    uploadLink,
    wsLink,
  };

  if (!apolloCLient) {
    apolloCLient = createApolloClient(apolloConfig);
  }
  return apolloCLient;
};
