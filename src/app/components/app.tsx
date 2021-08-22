import { FunctionComponent } from 'preact';
import { Hierarchy } from './hierarchy.js';
import { getCorrectedLocale } from '../util/locale.js';
import { styled } from 'goober';
import { useWebApi } from '../web-api/hooks.js';

const AbsoluteTestContainer = styled('section')`
  background-color: rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: scroll;
  position: absolute;
  width: 100vw;
`;

const WhiteTestText = styled('p')<{ active?: boolean }>`
  color: hsl(var(--black));
  font-variant-numeric: tabular-nums;
  margin: 1rem 0;
  cursor: ${({ onClick, active }) => {
    if (!onClick) return 'default';
    if (active) return 'no-drop';
    return 'copy';
  }};
`;

const correctedLocale = getCorrectedLocale();

const formatter = new Intl.NumberFormat(correctedLocale, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  useGrouping: false,
});

export const App: FunctionComponent = () => {
  const { hierarchy, useGetter, useSetter } = useWebApi();

  const obiJackOn = useGetter<boolean>(36);
  const obiJackFlip = useSetter<void>(25);

  return (
    <AbsoluteTestContainer>
      <WhiteTestText>
        Motion: {useGetter<boolean>(65) ? '✅' : '⛔️'}
      </WhiteTestText>
      <WhiteTestText>
        Pressure: {formatter.format(useGetter<number>(67) || 0)} Pascal
      </WhiteTestText>
      <WhiteTestText>
        Temperature: {formatter.format(useGetter<number>(72) || 0)} °C
      </WhiteTestText>
      <WhiteTestText>
        PM<sub>2,5</sub>: {formatter.format(useGetter<number>(56) || 0)} ppm
      </WhiteTestText>
      <WhiteTestText active={Boolean(obiJackOn)} onClick={() => obiJackFlip()}>
        ObiJack relay: {obiJackOn ? '🎚' : '💤'}
      </WhiteTestText>
      {obiJackOn ? (
        <WhiteTestText>
          Humidity: {formatter.format(useGetter<number>(64) || 0)} %RH
        </WhiteTestText>
      ) : null}
      <Hierarchy element={hierarchy} />
    </AbsoluteTestContainer>
  );
};
