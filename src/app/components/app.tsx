import { FunctionComponent } from 'preact';
import { WebApiContext } from '../web-api/hooks.js';
import { styled } from 'goober';
import { useContext } from 'preact/hooks';

const AbsoluteTestContainer = styled('section')`
  position: absolute;
`;

const WhiteTestText = styled('p')`
  color: hsl(var(--white));
  margin: 1rem 0;
`;

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
  useGrouping: false,
});

export const App: FunctionComponent = () => {
  const { useGetter, useSetter } = useContext(WebApiContext);

  const obiJackOn = useGetter<boolean>(36);
  const obiJackFlip = useSetter<void>(25);

  return (
    <AbsoluteTestContainer>
      <WhiteTestText>
        Motion: {useGetter<boolean>(64) ? '✅' : '⛔️'}
      </WhiteTestText>
      <WhiteTestText>
        Pressure: {formatter.format(useGetter<number>(66) || 0)}
      </WhiteTestText>
      <WhiteTestText>
        Temperature: {formatter.format(useGetter<number>(71) || 0)}
      </WhiteTestText>
      <WhiteTestText onClick={() => obiJackFlip()}>
        ObiJack relay: {obiJackOn ? '🎚' : '💤'}
      </WhiteTestText>
      {obiJackOn ? (
        <WhiteTestText>
          Humidity: {formatter.format(useGetter<number>(63) || 0)}
        </WhiteTestText>
      ) : null}
    </AbsoluteTestContainer>
  );
};
