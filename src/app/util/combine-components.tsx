import { FunctionComponent, PreactDOMAttributes } from 'preact';
import { useMemo } from 'preact/hooks';

export const combineComponents = (
  ...components: FunctionComponent[]
): FunctionComponent => {
  return components.reduce(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (AccumulatedComponents, CurrentComponent) => {
      return ({ children }: PreactDOMAttributes): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

// eslint-disable-next-line comma-spacing
export const bindComponent = <T,>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: FunctionComponent<T>,
  props: T
): FunctionComponent<Partial<T>> => {
  return (innerProps) => {
    return useMemo(
      () => <Component {...{ ...props, ...innerProps }} />,
      [innerProps]
    );
  };
};
