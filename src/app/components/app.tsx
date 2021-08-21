import { FunctionComponent } from 'preact';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';
import { useContext } from 'preact/hooks';

const WhiteText = styled('p')`
  color: hsl(var(--white));
  margin: 0;
`;

export const App: FunctionComponent = () => {
  const { useGetter, useSetter } = useContext(WebApiContext);

  const pressure = useGetter<number>(66);
  const flipObiJack = useSetter<null>(25);

  return (
    <WhiteText onClick={() => flipObiJack(null)}>
      {pressure === null ? 'null' : pressure}
    </WhiteText>
  );
};
