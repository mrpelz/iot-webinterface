import { ComponentChild, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

export type TokenComponent = FunctionComponent<{ value: string }>;
export type Tokens = Map<RegExp, TokenComponent>;

const TestTokenComponent: TokenComponent = ({ value }) => <u>{value}</u>;

export const testTokens: Tokens = new Map([
  [
    new RegExp(
      String.raw`(?:(?:[a-zA-Zß][a-zA-Z0-9ß]*\.)+[a-zA-Zß][a-zA-Z0-9ß]*)`,
      'm',
    ),
    TestTokenComponent,
  ],
]);

export const FallbackTokenComponent: TokenComponent = ({ value }) => (
  <span>{value}</span>
);

export const Tokenize: FunctionComponent<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FallbackComponent?: TokenComponent;
  input: string;
  tokens: Tokens;
}> = ({
  input,
  tokens,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FallbackComponent = FallbackTokenComponent,
}): ComponentChild => {
  const fragments = useMemo(() => {
    let string = input;

    const result: ComponentChild[] = [];

    while (string.length > 0) {
      const intermediate = string;

      for (const [regexp, Component] of tokens.entries()) {
        const match = intermediate.match(regexp);
        if (!match) continue;

        const matchedString = match[0];
        const start = match.index ?? 0;
        const end = start + matchedString.length;

        if (start !== 0) {
          result.push(
            <FallbackComponent value={intermediate.slice(0, start)} />,
          );
        }

        result.push(<Component value={matchedString} />);

        string = intermediate.slice(end);
        break;
      }

      if (intermediate === string) break;
    }

    if (string.length > 0) {
      result.push(<FallbackComponent value={string} />);
    }

    return result;
  }, [FallbackComponent, input, tokens]);

  return <>{fragments}</>;
};
