import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Query } from "react-apollo";

import { Anchor } from "../../components/common/Text";
import PostOverlay from "../../components/post/PostOverlay";
import Modal from "../../components/common/Modal";
import PostCard from "../../components/postcard/PostCard";
import { Spacing, Container } from "../../components/common/Layout";
import { Loading } from "../../components/common/Loading";
import InfiniteScroll from "../../components/common/InfiniteScroll";
import Skeleton from "../../components/common/Skeleton";
import CreatePost from "../../components/CreatePost";
import Head from "../../components/common/Head";

import { GET_FOLLOWED_POSTS } from "../../graphql/Post/index";

import { useStore } from "../../store/index";

import { HOME_PAGE_POSTS_LIMIT } from "../../constants/size";

import * as Routes from "../../routes";

const Empty = styled.div`
  padding: ${(p) => p.theme.spacing.sm};
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  margin-top: ${(p) => p.theme.spacing.lg};
  background-color: ${(p) => p.theme.colors.white};
`;

const StyledA = styled(Anchor)`
  text-decoration: underline;
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

/**
 * Home page of the app
 */
const Home = () => {
  const [{ auth }] = useStore();
  const [modalPostId, setModalPostId] = useState(null);

  const closeModal = () => {
    window.history.pushState("", "", "/");
    setModalPostId(null);
  };

  const openModal = (postId) => {
    window.history.pushState("", "", generatePath(Routes.POST, { id: postId }));
    setModalPostId(postId);
  };

  const userid = auth && auth.user && auth.user.id;
  const variables = {
    userId: userid,
    skip: 0,
    limit: HOME_PAGE_POSTS_LIMIT,
  };

  return (
    <Container maxWidth="sm">
      <Head />

      <Spacing top="lg" />

      <CreatePost />

      <Query
        query={GET_FOLLOWED_POSTS}
        variables={variables}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, fetchMore, networkStatus }) => {
          if (loading && networkStatus === 1) {
            return (
              <Skeleton
                height={500}
                bottom="lg"
                top="lg"
                count={HOME_PAGE_POSTS_LIMIT}
              />
            );
          }

          const { posts, count } = data.getFollowedPosts;

          if (!posts.length) {
            return (
              <div>
                <StyledA to={generatePath(Routes.SEARCH)}>
                  Explore new posts
                </StyledA>
              </div>
            );
          }

          return (
            <InfiniteScroll
              data={posts}
              dataKey="getFollowedPosts.posts"
              count={parseInt(count)}
              variables={variables}
              fetchMore={fetchMore}
            >
              {(data) => {
                const showNextLoading =
                  loading && networkStatus === 3 && count !== data.length;

                return (
                  <Fragment>
                    {data.map((post) => (
                      <Fragment key={post.id}>
                        <Modal
                          open={modalPostId === post.id}
                          onClose={closeModal}
                        >
                          <PostOverlay id={post.id} closeModal={closeModal} />
                        </Modal>

                        <Spacing bottom="lg" top="lg">
                          <PostCard
                            author={post.author}
                            imagePublicId={post.imagePublicId}
                            postId={post.id}
                            comments={post.comments}
                            createdAt={post.createdAt}
                            title={post.title}
                            image={post.image}
                            likes={post.likes}
                            openModal={() => openModal(post.id)}
                          />
                        </Spacing>
                      </Fragment>
                    ))}

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              }}
            </InfiniteScroll>
          );
        }}
      </Query>
    </Container>
  );
};

export default Home;
