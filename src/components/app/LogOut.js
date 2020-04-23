import React from "react";
import PropTypes from "prop-types";
import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import { Button } from "../common/Form";

import * as Routes from "../../routes";

import { useStore } from "../../store";
import { CLEAR_AUTH_USER } from "../../constants/actions";

/**
 * Component that Logout out the user
 */
const LogOut = ({ client, history }) => {
  const [, dispatch] = useStore();

  const handleLogOut = () => {
    dispatch({ type: CLEAR_AUTH_USER });
    localStorage.removeItem("token");
    client.resetStore();
    history.push(Routes.HOME);
  };

  return (
    <Button text onClick={handleLogOut}>
      LogOut
    </Button>
  );
};

LogOut.propTypes = {
  history: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
};

export default withRouter(withApollo(LogOut));
