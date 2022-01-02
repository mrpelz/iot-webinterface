import { FunctionComponent, JSX, createContext } from 'preact';
import { colors, dimensions } from '../style.js';
import { useContext, useLayoutEffect, useRef, useState } from 'preact/hooks';
import {
  useNavigationRoom,
  useNavigationStaticPage,
} from '../hooks/navigation.js';
import { Translation } from '../hooks/i18n.js';
import { add } from '../style/dimensions.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

const ProgrammaticPaddingContext = createContext(
  null as unknown as (padding: number) => void
);

const _Titlebar = styled('section')<{ padding: number }>`
  border-block-end: ${dimensions.hairline} solid ${colors.fontTertiary()};
  display: flex;
  font-weight: bold;
  height: ${dimensions.titlebarHeight};
  justify-content: center;
  padding: ${dimensions.fontPadding};
  position: relative;
  word-break: break-all;

  padding-inline: ${({ padding }) =>
    add(dimensions.fontPadding, `${padding}px`)};
`;

const _Title = styled('h1')`
  font-size: ${dimensions.fontSize};
  line-height: ${dimensions.fontSize};
  margin: 0;
  color: ${colors.fontPrimary()};
`;

const _IconContainer = styled('div', forwardRef)<{ right?: true }>`
  display: flex;
  position: absolute;
  color: ${colors.fontPrimary()};
  top: 0;

  ${({ right }) => (right ? 'right' : 'left')}: 0;

  & > * {
    height: ${dimensions.titlebarHeight};
    padding: ${dimensions.fontPadding};
  }
`;

export const IconContainer: FunctionComponent<{ right?: true }> = ({
  children,
  right,
}) => {
  const setPadding = useContext(ProgrammaticPaddingContext);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setPadding(ref.current.clientWidth);
  }, [ref, setPadding]);

  return (
    <_IconContainer ref={ref} right={right}>
      {children}
    </_IconContainer>
  );
};

export const Titlebar: FunctionComponent<{
  iconsLeft?: JSX.Element[];
  iconsRight?: JSX.Element[];
}> = ({ iconsLeft, iconsRight }) => {
  const [padding, setPadding] = useState(0);

  useLayoutEffect(() => {
    setPadding(0);
  }, [iconsLeft, iconsRight]);

  const [room] = useNavigationRoom();
  const [staticPage] = useNavigationStaticPage();

  return (
    <_Titlebar padding={padding}>
      <_Title>
        <Translation i18nKey={staticPage || room?.meta.name} />
      </_Title>
      <ProgrammaticPaddingContext.Provider
        value={(number) =>
          setPadding((previous) => {
            if (previous > number) return previous;
            return number;
          })
        }
      >
        {iconsLeft?.length ? <IconContainer>{iconsLeft}</IconContainer> : null}
        {iconsRight?.length ? (
          <IconContainer right>{iconsRight}</IconContainer>
        ) : null}
      </ProgrammaticPaddingContext.Provider>
    </_Titlebar>
  );
};
