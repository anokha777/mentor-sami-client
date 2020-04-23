import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

/**
 * Component that manages changes to document head
 * currently we are editing only title, but you can add meta description, image ...
 */
const Head = ({ title }) => (
  <Helmet>
    <title>{title}</title>
  </Helmet>
);

Head.propTypes = {
  title: PropTypes.string.isRequired,
};

Head.defaultProps = {
  title: process.env.REACT_APP_SITE_NAME,
};

export default Head;
