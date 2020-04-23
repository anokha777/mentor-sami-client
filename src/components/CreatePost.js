import React, { useState } from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";

import { Spacing, Overlay, Container } from "./common/Layout";
import { Error } from "./common/Text";
import { Button } from "./common/Form";
import UserImage from "./common/UserImage";

//import ImageUpload from "./ImageUpload";

import { GET_FOLLOWED_POSTS, CREATE_POST } from "../graphql/Post/index";
import { GET_AUTH_USER, GET_USER_POSTS } from "../graphql/User/index";

import { useStore } from "../store/index";

import {
  PROFILE_PAGE_POSTS_LIMIT,
  HOME_PAGE_POSTS_LIMIT,
  MAX_POST_IMAGE_SIZE,
} from "../constants/dataLimit";

import { useGlobalMessage } from "./hooks/useGlobalMessage";

const Root = styled(Container)`
  border: 0;
  border: 1px solid ${(p) => p.theme.colors.border.main};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  margin: 0 ${(p) => p.theme.spacing.xs};
  padding-left: ${(p) => p.theme.spacing.sm};
  padding-top: ${(p) => p.theme.spacing.xs};
  border: 0;
  outline: none;
  resize: none;
  transition: 0.1s ease-out;
  height: ${(p) => (p.focus ? "80px" : "40px")};
  font-size: ${(p) => p.theme.font.size.xs};
  background-color: ${(p) => p.theme.colors.grey[100]};
  border-radius: ${(p) => p.theme.radius.md};
`;

const ImagePreviewContainer = styled.div`
  width: 150px;
  height: 150px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

/**
 * Component for creating a post
 */
const CreatePost = () => {
  const [{ auth }] = useStore();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");

  const message = useGlobalMessage();

  const handleReset = () => {
    setTitle("");
    setImage("");
    setIsFocused(false);
    setError("");
  };

  const handleOnFocus = () => setIsFocused(true);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleSubmit = async (e, createPost) => {
    e.preventDefault();
    createPost();
    handleReset();
  };

  return (
    <Mutation
      mutation={CREATE_POST}
      variables={{ input: { title, image, authorId: auth.user.id } }}
      refetchQueries={() => [
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
      ]}
    >
      {(createPost, { loading, error: apiError }) => {
        const isShareDisabled = loading || (!loading && !image && !title);

        return (
          <>
            {isFocused && <Overlay onClick={handleReset} />}

            <Root
              zIndex={isFocused ? "md" : "xs"}
              color="white"
              radius="sm"
              padding="sm"
            >
              <form onSubmit={(e) => handleSubmit(e, createPost)}>
                <Wrapper>
                  <UserImage image={auth.user.image} size={40} />

                  <Textarea
                    type="textarea"
                    name="title"
                    focus={isFocused}
                    value={title}
                    onFocus={handleOnFocus}
                    onChange={handleTitleChange}
                    placeholder="Ask your questions"
                  />
                </Wrapper>

                {image && (
                  <Spacing bottom="sm">
                    <ImagePreviewContainer>
                      <ImagePreview src={URL.createObjectURL(image)} />
                    </ImagePreviewContainer>
                  </Spacing>
                )}

                {isFocused && (
                  <Options>
                    <Buttons>
                      <Button text type="button" onClick={handleReset}>
                        Cancel
                      </Button>
                      <Button disabled={isShareDisabled} type="submit">
                        Share
                      </Button>
                    </Buttons>
                  </Options>
                )}

                {apiError ||
                  (error && (
                    <Spacing top="xs" bottom="sm">
                      <Error size="xs">
                        {apiError
                          ? "Something went wrong, please try again."
                          : error}
                      </Error>
                    </Spacing>
                  ))}
              </form>
            </Root>
          </>
        );
      }}
    </Mutation>
  );
};

export default CreatePost;
