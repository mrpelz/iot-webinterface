import { color, useColor } from '../style/colors.js';
import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';
import { string } from '../style/main.js';
import { styled } from 'goober';
import { useEffect } from 'preact/hooks';
import { useFlags } from '../hooks/flags.js';
import { useFlipMenuVisible } from '../hooks/menu.js';

const _App = styled('app')`
  background-color: ${color('backgroundPrimary')};
  color: ${color('fontPrimary')};
  display: flow-root;
  font-family: ${string('font')};
`;

export const App: FunctionComponent = () => {
  const { debug } = useFlags();
  const backgroundColor = useColor('backgroundPrimary');
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
