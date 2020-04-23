import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Query } from "react-apollo";

//import { Loading } from "components/Loading";
import { Icon } from "../common/Icon";
import PostComment from "../PostComment";
import { Spacing } from "../common/Layout";
import Head from "../common/Head";
import PostInfoOverlay from "./PostInfoOverlay";
import PostCommentsOverlay from "./PostCommentsOverlay";
import PostOptionsOverlay from "./PostOptionsOverlay";

import { GET_POST } from "../../graphql/Post";

const Root = styled.div`
  margin: 0 auto;
  margin: ${(p) => !p.usedInModal && p.theme.spacing.lg} 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
  border-radius: ${(p) => p.theme.radius.sm};
  z-index: ${(p) => (p.usedInModal ? p.theme.zIndex.xl : "inherit")};
  overflow: hidden;
  width: 100%;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: auto;
  }
`;

const Container = styled.div`
  max-height: ${(p) => (p.usedInModal ? "600px" : "auto")};
  overflow-y: ${(p) => (p.usedInModal ? "auto" : "inherit")};
  max-width: 1300px;
  background-color: ${(p) => p.theme.colors.white};
  display: flex;
  flex-direction: column;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    flex-direction: ${(p) => (p.usedInModal ? "row" : "column")};
    max-height: ${(p) => (p.usedInModal ? "600px" : "auto")};
    overflow-y: inherit;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: ${(p) => (p.usedInModal ? "center" : "flex-start")};
  justify-content: center;
  background-color: ${(p) => p.theme.colors.black};
  width: 100%;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    max-width: 1000px;
    min-width: 500px;
    height: ${(p) => (p.usedInModal ? "600px" : "auto")};
  }
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  width: ${(p) => !p.usedInModal && "100%"};
  max-height: ${(p) => (p.usedInModal ? "600px" : "100%")};
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  background-color: ${(p) => p.theme.colors.white};
  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: ${(p) => (p.usedInModal ? "360px" : "100%")};
    min-width: 360px;
  }
`;

const CloseOverlay = styled.div`
  display: block;
  position: fixed;
  right: 20px;
  top: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: ${(p) => p.theme.font.size.xs};
  border-bottom: 1px solid ${(p) => p.theme.colors.border.light};
  padding: ${(p) => p.theme.spacing.xs};
`;

/**
 * Displays post with comments and options
 * Meant to be used in Modal or Page component
 */
const PostOverlay = ({ id, closeModal, usedInModal }) => {
  return (
    <Query query={GET_POST} variables={{ id }}>
      {({ data, loading, error }) => {
        /*if (loading) return <Loading top="lg" />;
        if (error) return <NotFound />;*/

        const post = data.getPost;

        return (
          <Root usedInModal={usedInModal}>
            <Head
              title={post.title ? post.title : `${post.author.username}'s post`}
            />

            {closeModal && (
              <CloseOverlay onClick={closeModal}>
                <Icon icon="close" />
              </CloseOverlay>
            )}

            <Container usedInModal={usedInModal}>
              <Left usedInModal={usedInModal}>
                <Image src={post.image} usedInModal={usedInModal} />
              </Left>

              <Right usedInModal={usedInModal}>
                <Spacing>
                  <PostInfoOverlay author={post.author} />

                  {post.title && <Title>{post.title}</Title>}

                  <PostCommentsOverlay
                    usedInModal={usedInModal}
                    comments={post.comments}
                    postId={post.id}
                    postAuthor={post.author}
                  />
                </Spacing>

                <Spacing>
                  <PostOptionsOverlay
                    postId={post.id}
                    postAuthor={post.author}
                    postLikes={post.likes}
                  />

                  <PostComment post={post} />
                </Spacing>
              </Right>
            </Container>
          </Root>
        );
      }}
    </Query>
  );
};

PostOverlay.propTypes = {
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  usedInModal: PropTypes.bool.isRequired,
};

PostOverlay.defaultProps = {
  usedInModal: true,
};

export default withRouter(PostOverlay);
