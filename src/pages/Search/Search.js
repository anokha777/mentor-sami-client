import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { generatePath } from "react-router-dom";
import { Query } from "react-apollo";

import { Container } from "../../components/common/Layout";
import SearchCard from "./SearchCard";
import Skeleton from "../../components/common/Skeleton";
import PostOverlay from "../../components/post";
import Modal from "../../components/common/Modal";
import InfiniteScroll from "../../components/common/InfiniteScroll";
import { Loading } from "../../components/common/Loading";
import Head from "../../components/common/Head";

import { GET_POSTS } from "../../graphql/Post";

import { EXPLORE_PAGE_POSTS_LIMIT } from "../../constants/size";

import { useStore } from "../../store";

import * as Routes from "../../routes";

const Root = styled(Container)`
  margin-top: ${(p) => p.theme.spacing.lg};
  margin-bottom: ${(p) => p.theme.spacing.sm};

  @media (min-width: ${(p) => p.theme.screen.lg}) {
    margin-left: ${(p) => p.theme.spacing.lg};
    padding: 0;
  }
`;

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 3fr));
  grid-auto-rows: auto;
  grid-gap: 20px;
`;

/**
 * Explore page
 */
const Explore = () => {
  const [{ auth }] = useStore();

  const [modalPostId, setModalPostId] = useState(null);

  const closeModal = () => {
    window.history.pushState("", "", "/explore");
    setModalPostId(null);
  };

  const openModal = (postId) => {
    window.history.pushState("", "", generatePath(Routes.POST, { id: postId }));
    setModalPostId(postId);
  };

  const variables = {
    authUserId: auth.user.id,
    skip: 0,
    limit: EXPLORE_PAGE_POSTS_LIMIT,
  };

  return (
    <Root maxWidth="md">
      <Head title="Explore New Posts and Users" />

      <Query
        query={GET_POSTS}
        variables={variables}
        notifyOnNetworkStatusChange
      >
        {({ data, loading, fetchMore, networkStatus }) => {
          if (loading && networkStatus === 1) {
            return (
              <PostsContainer>
                <Skeleton height={300} count={EXPLORE_PAGE_POSTS_LIMIT} />
              </PostsContainer>
            );
          }

          const { posts, count } = data.getPosts;

          if (!posts.length > 0) return "No posts yet.";

          return (
            <InfiniteScroll
              data={posts}
              dataKey="getPosts.posts"
              count={parseInt(count)}
              variables={variables}
              fetchMore={fetchMore}
            >
              {(data) => {
                const showNextLoading =
                  loading && networkStatus === 3 && count !== data.length;

                return (
                  <Fragment>
                    <PostsContainer>
                      {data.map((post) => (
                        <Fragment key={post.id}>
                          <Modal
                            open={modalPostId === post.id}
                            onClose={closeModal}
                          >
                            <PostOverlay id={post.id} closeModal={closeModal} />
                          </Modal>

                          <SearchCard
                            image={post.image}
                            countLikes={post.likes.length}
                            countComments={post.comments.length}
                            openPostPopup={() => openModal(post.id)}
                          />
                        </Fragment>
                      ))}
                    </PostsContainer>

                    {showNextLoading && <Loading top="lg" />}
                  </Fragment>
                );
              }}
            </InfiniteScroll>
          );
        }}
      </Query>
    </Root>
  );
};

export default Explore;
