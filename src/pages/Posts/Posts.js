import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Content } from "../../components/common/Layout";
import PostOverlay from "../../components/post";

/**
 * Post detail page
 */
const Post = ({ match }) => {
  return (
    <Content>
      <PostOverlay usedInModal={false} id={match.params.id} />
    </Content>
  );
};

Post.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Post);
