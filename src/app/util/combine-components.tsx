import { FunctionComponent, PreactDOMAttributes } from 'preact';

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
