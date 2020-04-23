import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Mutation } from "react-apollo";

import { Icon } from "./common/Icon";
import { Anchor } from "./common/Text";
import { Spacing } from "./common/Layout";
import UserImage from "./common/UserImage";

import { GET_AUTH_USER, GET_USER } from "../graphql/User";
import { DELETE_COMMENT } from "../graphql/Comment";
import { GET_POST, GET_POSTS, GET_FOLLOWED_POSTS } from "../graphql/Post/index";

import { useNotifications } from "./hooks/useNotification";

import { useStore } from "../store/index";

import * as Routes from "../routes/index";

const DeleteButton = styled.button`
  cursor: pointer;
  display: none;
  background-color: transparent;
  border: 0;
  outline: 0;
  position: absolute;
  right: 7px;
  top: 6px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${(p) => p.theme.spacing.xxs} 0;
  font-size: ${(p) => p.theme.font.size.xxs};
  &:hover ${DeleteButton} {
    display: block;
  }
`;

const UserName = styled.div`
  color: ${(p) => p.theme.colors.primary.main};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

const CommentSection = styled.div`
  position: relative;
  word-wrap: break-word;
  overflow: hidden;
  padding: 0 ${(p) => p.theme.spacing.lg} ${(p) => p.theme.spacing.xxs}
    ${(p) => p.theme.spacing.xs};
  background-color: ${(p) => p.theme.colors.grey[100]};
  border-radius: ${(p) => p.theme.radius.lg};
  margin-left: ${(p) => p.theme.spacing.xxs};
  color: ${(p) => p.theme.colors.text.main};
`;

/**
 * Renders comments UI
 */
const Comment = ({ comment, postId, postAuthor }) => {
  const [{ auth }] = useStore();
  const notification = useNotifications();

  const handleDeleteComment = async (deleteComment) => {
    await deleteComment();

    // Delete notification after comment deletion
    if (auth.user.id !== postAuthor.id) {
      const isNotified = postAuthor.notifications.find(
        (n) => n.comment && n.comment.id === comment.id
      );
      notification.remove({
        notificationId: isNotified.id,
      });
    }
  };

  return (
    <Mutation
      mutation={DELETE_COMMENT}
      variables={{ input: { id: comment.id } }}
      refetchQueries={() => [
        { query: GET_FOLLOWED_POSTS, variables: { userId: auth.user.id } },
        { query: GET_USER, variables: { username: comment.author.username } },
        { query: GET_AUTH_USER },
        { query: GET_POSTS, variables: { authUserId: auth.user.id } },
        { query: GET_POST, variables: { id: postId } },
      ]}
    >
      {(deleteComment) => {
        return (
          <Root>
            <Anchor
              to={generatePath(Routes.USER_PROFILE, {
                username: comment.author.username,
              })}
            >
              <UserImage image={comment.author.image} />
            </Anchor>

            <CommentSection>
              {comment.author.id === auth.user.id && (
                <DeleteButton
                  onClick={() => handleDeleteComment(deleteComment)}
                >
                  <Icon icon="close" width="10" />
                </DeleteButton>
              )}

              <Spacing top="xxs" />

              <Spacing inline right="xxs">
                <Anchor
                  to={generatePath(Routes.USER_PROFILE, {
                    username: comment.author.username,
                  })}
                >
                  <UserName>{comment.author.fullName}</UserName>
                </Anchor>
              </Spacing>

              {comment.comment}
            </CommentSection>
          </Root>
        );
      }}
    </Mutation>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  postAuthor: PropTypes.object.isRequired,
};

export default Comment;
