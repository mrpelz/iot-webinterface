import { colors, shadow, strings } from '../style.js';
import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { Icon } from './icon.js';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';
import { styled } from 'goober';
import { useEffect } from 'preact/hooks';
import { useFlags } from '../hooks/flags.js';
import { useFlipMenuVisible } from '../hooks/menu.js';

const _App = styled('app')`
  color-scheme: ${strings.colorScheme};
  background-color: ${colors.surface1()};
  color: ${colors.text1()};
  display: flow-root;
  font-family: ${strings.font};
`;

const _Surface = styled('div')`
  align-items: center;
  border-radius: 20px;
  color: ${colors.text1()};
  display: flex;
  font-size: 50px;
  height: 100px;
  justify-content: center;
  margin: 50px;
  width: 100px;

  box-shadow: ${shadow()};
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

export const App: FunctionComponent = () => {
  const { diagnostics } = useFlags();
  const backgroundColor = colors.surface1()();
  const flipMenuVisible = useFlipMenuVisible();

  useEffect(() => {
    const documentStyle = document.documentElement.style;
    const memo = documentStyle.backgroundColor;

    documentStyle.backgroundColor = backgroundColor;

    return () => {
      documentStyle.backgroundColor = memo;
    };
  }, [backgroundColor]);

  return (
    <_App>
      <Layout
        header={
          <>
            <StatusBar />
            <Titlebar>titlebar</Titlebar>
            <Notification />
          </>
        }
        aside={<Menu />}
      >
        {diagnostics ? (
          <Diagnostics />
        ) : (
          <>
            <a href="#diagnostics=1">Diagnostics</a>
            <div onClick={flipMenuVisible}>
              <_Surface1>1</_Surface1>
              <_Surface2>2</_Surface2>
              <_Surface3>3</_Surface3>
              <_Surface4>4</_Surface4>
              <_Text1>Text 1</_Text1>
              <_Text2>Text 2</_Text2>
              <Icon id="wait" />
              <Icon id="menu" />
              <Icon id="map" />
              <Icon id="back" />
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
            </div>
          </>
        )}
      </Layout>
    </_App>
  );
};
