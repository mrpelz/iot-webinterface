import { colors, strings } from '../style.js';
import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
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
  background-color: ${colors.backgroundPrimary()};
  color: ${colors.fontPrimary()};
  display: flow-root;
  font-family: ${strings.font};
`;

export const App: FunctionComponent = () => {
  const { debug } = useFlags();
  const backgroundColor = colors.backgroundPrimary()();
  const flipMenuVisible = useFlipMenuVisible();

  useEffect(() => {
    document.documentElement.style.backgroundColor = backgroundColor;
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
        <div onClick={flipMenuVisible}>
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
        {debug ? <Diagnostics /> : null}
      </Layout>
    </_App>
  );
};
