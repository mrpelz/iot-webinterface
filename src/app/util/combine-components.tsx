import { FunctionComponent, JSX, PreactDOMAttributes } from 'preact';
import { useMemo } from 'preact/hooks';

export const combineComponents = (
  ...components: FunctionComponent[]
): FunctionComponent =>
  // eslint-disable-next-line unicorn/no-array-reduce
  components.reduce(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (AccumulatedComponents, CurrentComponent) =>
      ({ children }: PreactDOMAttributes): JSX.Element => (
        <AccumulatedComponents>
          <CurrentComponent>{children}</CurrentComponent>
        </AccumulatedComponents>
      ),
    ({ children }) => <>{children}</>,
  );

export const bindComponent =
  <T,>(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Component: FunctionComponent<T>,
    props: T,
    overrideProps?: Partial<T>,
  ): FunctionComponent<Partial<T>> =>
  (innerProps) =>
    useMemo(
      () => <Component {...{ ...props, ...innerProps, ...overrideProps }} />,
      [innerProps],
    );
