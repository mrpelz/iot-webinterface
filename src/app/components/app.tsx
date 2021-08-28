import {
  FakeNotificationContext,
  Notification,
  useFakeNotificationInsert,
} from './notification.js';
import {
  Menu,
  MenuVisibleContext,
  flipMenuVisible,
  useMenuVisibleInsert,
} from './menu.js';
import { Diagnostics } from './diagnostics.js';
import { FunctionComponent } from 'preact';
import { Layout } from './layout.js';
import { StatusBar } from './status-bar.js';
import { Titlebar } from './titlebar.js';

export const App: FunctionComponent = () => {
  return (
    <MenuVisibleContext.Provider value={useMenuVisibleInsert()}>
      <FakeNotificationContext.Provider value={useFakeNotificationInsert()}>
        <Diagnostics />
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
        </Layout>
      </FakeNotificationContext.Provider>
    </MenuVisibleContext.Provider>
  );
};
