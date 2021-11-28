import { colors, shadow } from '../../style.js';
import { FunctionComponent } from 'preact';
import { refreshServiceWorker } from '../../util/workers.js';
import { styled } from 'goober';

const _Surface = styled('div')`
  align-items: center;
  border-radius: 20px;
  box-shadow: ${shadow()};
  color: ${colors.fontPrimary()};
  display: flex;
  font-size: 50px;
  height: 100px;
  justify-content: center;
  margin: 50px;
  width: 100px;
`;
const _Surface0 = styled(_Surface)`
  background-color: ${colors.surface0()};
`;
const _Surface1 = styled(_Surface)`
  background-color: ${colors.surface1()};
`;
const _Surface2 = styled(_Surface)`
  background-color: ${colors.surface2()};
`;
const _Surface3 = styled(_Surface)`
  background-color: ${colors.surface3()};
`;
const _Surface4 = styled(_Surface)`
  background-color: ${colors.surface4()};
`;
const _Text = styled('div')`
  font-size: 35px;
`;
const _Text1 = styled(_Text)`
  color: ${colors.text1()};
`;
const _Text2 = styled(_Text)`
  color: ${colors.text2()};
`;

export const Global: FunctionComponent = () => (
  <>
    <button
      onClick={() => {
        if (refreshServiceWorker()) return;
        location.reload();
      }}
    >
      Refresh
    </button>
    <_Surface0>0</_Surface0>
    <_Surface1>1</_Surface1>
    <_Surface2>2</_Surface2>
    <_Surface3>3</_Surface3>
    <_Surface4>4</_Surface4>
    <_Text1>Text 1</_Text1>
    <_Text2>Text 2</_Text2>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
    <section>main</section>
  </>
);
