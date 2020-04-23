import dotenv from "dotenv";
import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

import { ThemeProvider } from "styled-components";

import initApolloClient from "./apollo/initApolloClient";
import { AppStoreProvider } from "./store";
import App from "./components/app/App";
import theme from "../src/utils/theme";
//import "./styles/index.scss";
console.log("process env", process.env);
console.log("server url", process.env.SERVER_URL);
const SERVER_URL = "http://localhost:4000/graphql";

dotenv.config();
const serverUrl = process.env.REACT_APP_API_URL || SERVER_URL;
const client = initApolloClient(serverUrl);

render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <ThemeProvider theme={theme}>
        <AppStoreProvider>
          <App />
        </AppStoreProvider>
      </ThemeProvider>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
