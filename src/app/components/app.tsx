import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { Menu } from './menu.js';
import { Notification } from './notification.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';
import { useFlags } from '../hooks/flags.js';
import { useFlipMenuVisible } from '../hooks/menu.js';

export const App: FunctionComponent = () => {
  const { debug } = useFlags();
  const flipMenuVisible = useFlipMenuVisible();
  return (
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
  );
};
