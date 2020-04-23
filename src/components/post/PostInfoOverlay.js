import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { generatePath } from "react-router-dom";

import { Anchor } from "../common/Text";
import Follow from "../common/Follow";
import { Spacing } from "../common/Layout";
import UserImage from "../common/UserImage";

import * as Routes from "../../routes/index";

import { useStore } from "../../store";

const Root = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.xs};
  margin-bottom: ${(p) => p.theme.spacing.xxs};
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: ${(p) => p.theme.spacing.sm};
`;

const UserName = styled.div`
  max-width: 100%;
  font-size: ${(p) => p.theme.font.size.xs};
  font-weight: ${(p) => p.theme.font.weight.bold};
`;

/**
 * Author info for PostPopup component
 */
const PostInfoOverlay = ({ author }) => {
  const [{ auth }] = useStore();

  return (
    <Root>
      <Author>
        <Anchor
          to={generatePath(Routes.USER_PROFILE, { username: author.username })}
        >
          <UserImage image={author.image} />
        </Anchor>

        <Spacing left="xs" inline>
          <Anchor
            to={generatePath(Routes.USER_PROFILE, {
              username: author.username,
            })}
          >
            <UserName>{author.fullName}</UserName>
          </Anchor>
        </Spacing>
      </Author>

      {auth.user.id !== author.id && <Follow user={author} />}
    </Root>
  );
};

PostInfoOverlay.propTypes = {
  author: PropTypes.object.isRequired,
};

export default PostInfoOverlay;
