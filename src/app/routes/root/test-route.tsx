import { styled } from 'goober';
import { FunctionComponent } from 'preact';

import {
  Accordion,
  Dialog,
  Drawer,
  Menu,
  Menubar,
} from '../../components/base-ui/index.js';
import { JSONViewer } from '../../components/json-viewer/main.js';
import { $isRoot, getSegment, goRoot, setSegment } from '../../state/path.js';
import { useTitleOverride } from '../../state/title.js';

const $route1 = getSegment(1);
const setRoute1 = setSegment(1);

const $route2 = getSegment(2);
const setRoute2 = setSegment(2);

const Margin = styled('section')`
  margin: 2rem;
`;

export const Test: FunctionComponent = () => {
  const isRoot = $isRoot.value;
  const route1 = $route1.value;

  const route2 = $route2.value;

  useTitleOverride(route2 || route1 || undefined);

  return (
    <>
      <button
        onClick={() =>
          setRoute1(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route1 || '<none>'}
      </button>
      <br />
      <button
        disabled={!route1}
        onClick={() => setRoute1(undefined)}
      >
        reset
      </button>
      <br />
      <br />
      <button
        onClick={() =>
          setRoute2(Math.round(Math.random() * 10 ** 16).toString(16))
        }
      >
        {route2 || '<none>'}
      </button>
      <br />
      <button
        disabled={!route2}
        onClick={() => setRoute2(undefined)}
      >
        reset
      </button>
      <br />
      <br />
      <button
        disabled={isRoot}
        onClick={() => goRoot()}
      >
        go root
      </button>
      <Margin>
        <JSONViewer
          autoExpandPath={['a', 'b', 'c', 'd', 'e', 2]}
          rootLabel="Test"
          value={{
            a: {
              b: {
                c: {
                  d: {
                    e: [
                      { f: 'fuck I' },
                      { f: 'fuck II' },
                      { f: 'fuck III' },
                      { f: 'fuck IV' },
                    ],
                  },
                },
              },
            },
          }}
        />
      </Margin>
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Popup>
            <Dialog.Intro>
              <Dialog.Title>Subscribe</Dialog.Title>
              <Dialog.Description>
                Enter your email to subscribe.
              </Dialog.Description>
            </Dialog.Intro>
            <Dialog.Actions>
              <Dialog.Close>Cancel</Dialog.Close>
            </Dialog.Actions>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <Accordion.Root>
        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              What is Base UI?
              <Accordion.Icon />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <Accordion.Content>
              Base UI is a library of high-quality unstyled React components for
              design systems and web apps.
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              How do I get started?
              <Accordion.Icon />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <Accordion.Content>
              Head to the “Quick start” guide in the docs. If you’ve used
              unstyled libraries before, you’ll feel at home.
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item>
          <Accordion.Header>
            <Accordion.Trigger>
              Can I use it for my project?
              <Accordion.Icon />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <Accordion.Content>
              Of course! Base UI is free and open source.
            </Accordion.Content>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <Menubar>
        <Menu.Root>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4}>
              <Menu.Popup>
                <Menu.Item>New</Menu.Item>
                <Menu.Item>Open</Menu.Item>
                <Menu.Item>Save</Menu.Item>

                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    Export
                    <Menubar.CaretRightIcon />
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner
                      alignOffset={-4}

                      sideOffset={-4}
                    >
                      <Menu.Popup>
                        <Menu.Item>PDF</Menu.Item>
                        <Menu.Item>PNG</Menu.Item>
                        <Menu.Item>SVG</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>

                <Menu.Separator />
                <Menu.Item>Print</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4}>
              <Menu.Popup>
                <Menu.Item>Cut</Menu.Item>
                <Menu.Item>Copy</Menu.Item>
                <Menu.Item>Paste</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>View</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner sideOffset={4}>
              <Menu.Popup>
                <Menu.Item>Zoom In</Menu.Item>
                <Menu.Item>Zoom Out</Menu.Item>

                <Menu.SubmenuRoot>
                  <Menu.SubmenuTrigger>
                    Layout
                    <Menubar.CaretRightIcon />
                  </Menu.SubmenuTrigger>
                  <Menu.Portal>
                    <Menu.Positioner
                      alignOffset={-4}

                      sideOffset={-4}
                    >
                      <Menu.Popup>
                        <Menu.Item>Single Page</Menu.Item>
                        <Menu.Item>Two Pages</Menu.Item>
                        <Menu.Item>Continuous</Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.SubmenuRoot>

                <Menu.Separator />
                <Menu.Item>Full Screen</Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <Menu.Root disabled>
          <Menu.Trigger>Help</Menu.Trigger>
        </Menu.Root>
      </Menubar>

      <Drawer.Root>
        <Drawer.Trigger>Open drawer stack</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <div />
              <Drawer.Content>
                <Drawer.Title>Account</Drawer.Title>
                <Drawer.Description>
                  Nested drawers can be styled to stack, while each drawer
                  remains independently focus managed.
                </Drawer.Description>

                <div>
                  <div>
                    <Drawer.Root>
                      <Drawer.Trigger>Security settings</Drawer.Trigger>
                      <Drawer.Portal>
                        <Drawer.Viewport>
                          <Drawer.Popup>
                            <div />
                            <Drawer.Content>
                              <Drawer.Title>Security</Drawer.Title>
                              <Drawer.Description>
                                Review sign-in activity and update your security
                                preferences.
                              </Drawer.Description>

                              <ul>
                                <li>Passkeys enabled</li>
                                <li>2FA via authenticator app</li>
                                <li>3 signed-in devices</li>
                              </ul>

                              <div>
                                <div>
                                  <Drawer.Root>
                                    <Drawer.Trigger>
                                      Advanced options
                                    </Drawer.Trigger>
                                    <Drawer.Portal>
                                      <Drawer.Viewport>
                                        <Drawer.Popup>
                                          <div />
                                          <Drawer.Content>
                                            <Drawer.Title>
                                              Advanced
                                            </Drawer.Title>
                                            <Drawer.Description>
                                              This drawer is taller to
                                              demonstrate variable-height
                                              stacking.
                                            </Drawer.Description>

                                            <div>
                                              <label htmlFor="device-name">
                                                Device name
                                              </label>
                                              <input
                                                defaultValue="Personal laptop"

                                                id="device-name"
                                              />
                                            </div>

                                            <div>
                                              <label htmlFor="notes">
                                                Notes
                                              </label>
                                              <textarea
                                                defaultValue="Rotate recovery codes and revoke older sessions."

                                                id="notes"
                                                rows={3}
                                              />
                                            </div>

                                            <div>
                                              <Drawer.Close>Done</Drawer.Close>
                                            </div>
                                          </Drawer.Content>
                                        </Drawer.Popup>
                                      </Drawer.Viewport>
                                    </Drawer.Portal>
                                  </Drawer.Root>
                                </div>

                                <Drawer.Close>Close</Drawer.Close>
                              </div>
                            </Drawer.Content>
                          </Drawer.Popup>
                        </Drawer.Viewport>
                      </Drawer.Portal>
                    </Drawer.Root>
                  </div>

                  <Drawer.Close>Close</Drawer.Close>
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};
