import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: ${(p) => p.maxWidth && p.theme.screen[p.maxWidth]};
  margin-top: ${(p) => (p.marginTop ? p.theme.spacing[p.marginTop] : 0)};
  padding: ${(p) =>
    p.padding ? `0 ${p.theme.spacing[p.padding]}` : `0 ${p.theme.spacing.sm}`};
  z-index: ${(p) => p.zIndex && p.theme.zIndex[p.zIndex]};
  background-color: ${(p) => p.color && p.theme.colors[p.color]};
  border-radius: ${(p) => p.radius && p.theme.radius[p.radius]};
`;

export const Content = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  z-index: ${(p) => p.zIndex && p.theme.zIndex[p.zIndex]};
  min-height: 500px;
  @media (min-width: ${(p) => p.theme.screen.md}) {
    width: ${(p) => p.theme.screen.xs};
  }
  @media (min-width: ${(p) => p.theme.screen.lg}) {
    width: ${(p) => p.theme.screen.sm};
  }
`;

export const Spacing = styled.div`
  ${(p) => p.top && `margin-top: ${p.theme.spacing[p.top]}`};
  ${(p) => p.right && `margin-right: ${p.theme.spacing[p.right]}`};
  ${(p) => p.bottom && `margin-bottom: ${p.theme.spacing[p.bottom]}`};
  ${(p) => p.left && `margin-left: ${p.theme.spacing[p.left]}`};
  ${(p) => p.inline && `display: inline-block;`}
  @media (max-width: ${(p) => p.theme.screen.sm}) {
    ${(p) =>
      p.hideOnSm &&
      `
      display: none;
    `}
  }
`;

export const Overlay = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: ${(p) => p.theme.zIndex.md};
  background-color: rgba(
    0,
    0,
    0,
    ${(p) => (p.transparency ? p.transparency : "0.8")}
  );
`;
