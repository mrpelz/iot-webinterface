import { MapIcon, MenuIcon } from './icons.js';
import { colors, dimensions, shadow, strings } from '../style.js';
import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';
import { en } from '../i18n/en.js';
import { refreshServiceWorker } from '../util/workers.js';
import { styled } from 'goober';
import { useBreakpoint } from '../style/breakpoint.js';
import { useEffect } from 'preact/hooks';
import { useFlags } from '../hooks/flags.js';
import { useFlipMenuVisible } from '../hooks/menu.js';
import { useMediaQuery } from '../style/main.js';

const _App = styled('app')`
  background-color: ${colors.backgroundPrimary()};
  color-scheme: ${strings.colorScheme};
  display: flow-root;
  font-family: ${strings.font};
  font-size: ${dimensions.fontSize};
`;

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

export const App: FunctionComponent = () => {
  const { diagnostics } = useFlags();
  const isDesktop = useBreakpoint(useMediaQuery(dimensions.breakpoint));

  const backgroundColor = colors.backgroundSecondary()();
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
            <Titlebar
              iconsLeft={
                isDesktop ? [] : [<MenuIcon onClick={flipMenuVisible} />]
              }
              iconsRight={[<MapIcon />]}
            />
            <Notification />
          </>
        }
        aside={<Menu />}
      >
        {diagnostics ? (
          <Diagnostics />
        ) : (
          <>
            <a href="#diagnostics=1">{en.diagnostics}</a>
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
        )}
      </Layout>
    </_App>
  );
};
