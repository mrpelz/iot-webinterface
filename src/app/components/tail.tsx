import { styled } from 'goober';
import { FunctionComponent } from 'preact';
import { forwardRef, useEffect, useRef } from 'preact/compat';

import { colors, dimensions, strings } from '../style.js';

const TailContainer = styled('tail' as 'section', forwardRef)`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  background-color: ${colors.backgroundSecondary()};
  block-size: 100%;
  inline-size: 100%;
  overflow-block: auto;
  padding-block-end: ${strings.safeAreaInsetBottom};
  padding-inline: ${dimensions.fontPadding};
`;

export const Tail: FunctionComponent = ({ children }) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const { current: element } = ref;
    if (!element) return;
    if (element.scrollTop < -5) return;

    element.scrollTo({ behavior: 'smooth', top: 0 });
  }, [children]);

  return (
    <TailContainer ref={ref}>
      <div>{children}</div>
    </TailContainer>
  );
};

export const Separator = styled('separator' as 'section')`
  display: block;
  background-color: ${colors.selection()};
  block-size: ${dimensions.hairline};
  inline-size: 100%;
`;
