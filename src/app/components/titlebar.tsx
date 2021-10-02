import { FunctionComponent, JSX, createContext } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { add } from '../style/dimensions.js';
import { dimensions } from '../style.js';
import { forwardRef } from 'preact/compat';
import { styled } from 'goober';

const ProgrammaticPaddingContext = createContext(
  null as unknown as (padding: number) => void
);

const _Titlebar = styled('section')<{ padding: number }>`
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

const _IconContainer = styled('div', forwardRef)<{ right?: true }>`
  display: flex;
  position: absolute;
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

  useEffect(() => {
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
}> = ({ children, iconsLeft, iconsRight }) => {
  const [padding, setPadding] = useState(0);

  useEffect(() => {
    setPadding(0);
  }, [iconsLeft, iconsRight]);

  return (
    <_Titlebar padding={padding}>
      {children}
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
