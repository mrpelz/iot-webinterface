import { mergeClassNames } from '@base-ui/react';
import { isPlainObject } from '@mrpelz/misc-utils/oop';
import { FunctionComponent, JSX, PreactDOMAttributes } from 'preact';
import { useMemo } from 'preact/hooks';

export const combineComponents = (
  ...components: FunctionComponent[]
): FunctionComponent =>
  // eslint-disable-next-line unicorn/no-array-reduce
  components.reduce(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (AccumulatedComponents, CurrentComponent) => {
      const Result = ({ children }: PreactDOMAttributes): JSX.Element => (
        <AccumulatedComponents>
          <CurrentComponent>{children}</CurrentComponent>
        </AccumulatedComponents>
      );

      return Result;
    },
    ({ children }) => <>{children}</>,
  );

export const bindComponent = <T,>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: FunctionComponent<T>,
  props: Partial<T>,
  overrideProps: Partial<T> = {},
): FunctionComponent<T> => {
  const outerClassName = mergeClassNames(
    isPlainObject(props) &&
      'className' in props &&
      typeof props.className === 'string'
      ? props.className
      : undefined,
    isPlainObject(overrideProps) &&
      'className' in overrideProps &&
      typeof overrideProps.className === 'string'
      ? overrideProps.className
      : undefined,
  );

  return (innerProps) => {
    const className = useMemo(
      () =>
        mergeClassNames(
          outerClassName,
          'className' in innerProps && typeof innerProps.className === 'string'
            ? innerProps.className
            : undefined,
        ),
      [innerProps],
    );

    return useMemo(
      () => (
        <Component
          {...{ ...props, ...innerProps, ...overrideProps, className }}
        />
      ),
      [className, innerProps],
    );
  };
};
