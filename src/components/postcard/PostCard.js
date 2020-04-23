import React, { useState } from "react";
import PropTypes from "prop-types";
import { generatePath } from "react-router-dom";
import styled from "styled-components";
import { withApollo } from "react-apollo";

import Comment from "../Comment";
import CreateComment from "../PostComment";
import UpVote from "../UpVote";
import { Icon } from "../common/Icon";
import { Spacing } from "../common/Layout";
import { Anchor, H3 } from "../common/Text";
import { Button } from "../common/Form";
import PostCardOption from "./PostCardOption";
import Modal from "../common/Modal";
import UserImage from "../common/UserImage";

import { GET_FOLLOWED_POSTS, DELETE_POST } from "../../graphql/Post/index";
import { GET_AUTH_USER, GET_USER_POSTS } from "../../graphql/User/index";

import {
  HOME_PAGE_POSTS_LIMIT,
  PROFILE_PAGE_POSTS_LIMIT,
} from "../../constants/dataLimit";

import { useStore } from "../../store";

import * as Routes from "../../routes/index";

import { timeAgo } from "../../utils/time";

const Root = styled.div`
  width: 100%;
  border-radius: ${(p) => p.theme.radius.sm};
  padding-bottom: ${(p) => p.theme.spacing.xs};
  background-color: ${(p) => p.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${(p) => p.theme.spacing.xs} ${(p) => p.theme.spacing.sm};
`;

const CreatedAt = styled.div`
  font-size: ${(p) => p.theme.font.size.xxs};
  color: ${(p) => p.theme.colors.text.hint};
  border-bottom: 1px solid ${(p) => p.theme.colors.text.secondary};
  border: 0;
  margin-top: 2px;
`;

const Author = styled(Anchor)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.span`
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.bold};
  color: ${(p) => p.theme.colors.primary.main};
`;

const Poster = styled.img`
  display: block;
  width: 100%;
  max-height: 700px;
  object-fit: cover;
  cursor: pointer;
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const BottomRow = styled.div`
  overflow: hidden;
`;

const CountAndIcons = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
`;

const Count = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${(p) => p.theme.spacing.xs};
  font-size: ${(p) => p.theme.font.size.xs};
  color: ${(p) => p.theme.colors.text.secondary};
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Comments = styled.div`
  padding: 0 ${(p) => p.theme.spacing.sm};
`;

const StyledButton = styled(Button)`
  padding: 0;
  padding-left: 4px;
  font-size: ${(p) => p.theme.font.size.xxs};
`;

const CommentLine = styled.div`
  margin-bottom: 5px;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
`;

/**
 * Component for rendering user post
 */
const PostCard = ({
  author,
  imagePublicId,
  comments,
  title,
  createdAt,
  image,
  likes,
  postId,
  openModal,
  client,
}) => {
  const [{ auth }] = useStore();
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const toggleCreateComment = () => {
    setIsCommentOpen(true);
  };

  const toggleComment = () => {
    setIsCommentOpen(!isCommentOpen);
  };

  const closeOption = () => setIsOptionOpen(false);

  const openOption = () => setIsOptionOpen(true);

  const deletePost = async () => {
    try {
      await client.mutate({
        mutation: DELETE_POST,
        variables: { input: { id: postId, imagePublicId } },
        refetchQueries: () => [
          {
            query: GET_FOLLOWED_POSTS,
            variables: {
              userId: auth.user.id,
              skip: 0,
              limit: HOME_PAGE_POSTS_LIMIT,
            },
          },
          { query: GET_AUTH_USER },
          {
            query: GET_USER_POSTS,
            variables: {
              username: auth.user.username,
              skip: 0,
              limit: PROFILE_PAGE_POSTS_LIMIT,
            },
          },
        ],
      });
    } catch (err) {}

    setIsOptionOpen(false);
  };

  return (
    <>
      <Root>
        <Modal onClose={closeOption} open={isOptionOpen}>
          <PostCardOption
            postId={postId}
            closeOption={closeOption}
            author={author}
            deletePost={deletePost}
          />
        </Modal>

        <TopRow>
          <Author
            to={generatePath(Routes.USER_PROFILE, {
              username: author.username,
            })}
          >
            <UserImage image={author.image} />

            <Spacing left="xs">
              <Name>{author.fullName}</Name>
              <CreatedAt>{timeAgo(createdAt)}</CreatedAt>
            </Spacing>
          </Author>

          <Button ghost onClick={openOption}>
            <Icon icon="ellipsis-h" />
          </Button>
        </TopRow>

        <Spacing left="sm" bottom="sm" top="xs">
          <H3>{title}</H3>
        </Spacing>

        {image && <Poster src={image} onClick={openModal} />}

        <BottomRow>
          <CountAndIcons>
            <Count>
              {likes.length} likes
              <Spacing />
              <StyledButton onClick={toggleComment} text>
                {comments.length} comments
              </StyledButton>
            </Count>

            <Icons>
              <UpVote
                fullWidth
                withText
                user={author}
                postId={postId}
                likes={likes}
              />

              <Button fullWidth text onClick={toggleCreateComment}>
                <Icon icon="comment" /> <Spacing inline left="xxs" />{" "}
                <b>Comment</b>
              </Button>
            </Icons>
          </CountAndIcons>

          {isCommentOpen && (
            <>
              <Spacing top="xs">
                <CommentLine />
                <CreateComment
                  post={{ id: postId, author }}
                  focus={isCommentOpen}
                />
              </Spacing>

              {comments.length > 0 && <CommentLine />}

              <Comments>
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postId={postId}
                    postAuthor={author}
                  />
                ))}
              </Comments>
            </>
          )}
        </BottomRow>
      </Root>
    </>
  );
};

PostCard.propTypes = {
  author: PropTypes.object.isRequired,
  imagePublicId: PropTypes.string,
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  likes: PropTypes.array.isRequired,
  comments: PropTypes.array,
  createdAt: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
};

export default withApollo(PostCard);
