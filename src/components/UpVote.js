import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Mutation } from "react-apollo";

import { Icon } from "./common/Icon";
import { Spacing } from "./common/Layout";
import { Button } from "./common/Form";

import { GET_FOLLOWED_POSTS, GET_POSTS } from "../graphql/Post/index";
import { GET_AUTH_USER } from "../graphql/User/index";
import { CREATE_LIKE, DELETE_LIKE } from "../graphql/Like/index";

import { NotificationType } from "../constants/notification";

import { useNotifications } from "./hooks/useNotification";

import { useStore } from "../store/index";

const StyledButton = styled(Button)`
  padding: ${(p) => p.theme.spacing.xs} 0;
`;

/**
 * Component for rendering Like button
 */
const UpVote = ({ postId, user, likes, withText, fullWidth }) => {
  const [loading, setLoading] = useState(false);

  const [{ auth }] = useStore();

  const notification = useNotifications();

  const hasLiked = likes.find(
    (l) => l.user === auth.user.id && l.post === postId
  );

  const handleButtonClick = async (mutate) => {
    setLoading(true);
    const { data } = await mutate();

    // Create or delete notification for like
    if (auth.user.id === user.id) return setLoading(false);
    await notification.toggle({
      user,
      postId,
      hasDone: hasLiked,
      notificationType: NotificationType.LIKE,
      notificationTypeId: data.createLike ? data.createLike.id : null,
    });
    setLoading(false);
  };

  // Detect which mutation to use
  const operation = hasLiked ? "delete" : "create";
  const options = {
    create: {
      mutation: CREATE_LIKE,
      variables: { postId, userId: auth.user.id },
    },
    delete: {
      mutation: DELETE_LIKE,
      variables: { id: hasLiked ? hasLiked.id : null },
    },
  };

  return (
    <Mutation
      mutation={options[operation].mutation}
      variables={{ input: { ...options[operation].variables } }}
      refetchQueries={() => [
        { query: GET_AUTH_USER },
        { query: GET_POSTS, variables: { authUserId: auth.user.id } },
        { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user.id } },
      ]}
    >
      {(mutate) => {
        return (
          <StyledButton
            fullWidth={fullWidth}
            disabled={loading}
            text
            onClick={() => handleButtonClick(mutate)}
            color={hasLiked && "primary.main"}
          >
            <Icon icon="thumbs-up" />
            <Spacing inline left="xxs" />
            {withText && <b>UpVote</b>}
          </StyledButton>
        );
      }}
    </Mutation>
  );
};

UpVote.propTypes = {
  postId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  likes: PropTypes.array,
  withText: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default UpVote;
