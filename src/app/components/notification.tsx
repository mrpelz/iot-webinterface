import { FunctionComponent, createContext } from 'preact';
import { StateUpdater, useContext, useState } from 'preact/hooks';
import { styled } from 'goober';

export type Notification = {
  content: string | null;
  onClick?: () => void;
  onDismiss?: () => void;
};

const _Notification = styled('section')<{ isVisible: boolean }>`
  overflow: hidden;
  transition: background-color 0.3s ease-out, height 0.3s ease-out;

  background-color: ${({ isVisible }) => {
    return isVisible ? 'darkred' : 'rgba(0, 0, 0, 0)';
  }};

  cursor: ${({ onClick }) => {
    return onClick ? 'pointer' : 'default';
  }};

  height: ${({ isVisible }) => {
    return isVisible ? 'var(--titlebar-height)' : '0';
  }};
`;

export const FakeNotificationContext = createContext<Notification>(
  null as unknown as Notification
);

export let setFakeNotification: StateUpdater<Notification> = () => undefined;

export function clearFakeNotification(): void {
  setFakeNotification({ content: null });
}

export function useFakeNotificationInsert(): Notification {
  const [fakeNotification, _setFakeNotification] = useState<Notification>({
    content: null,
  });
  setFakeNotification = _setFakeNotification;

  return fakeNotification;
}

export const Notification: FunctionComponent = () => {
  const { content, onClick } = useContext(FakeNotificationContext);

  return (
    <_Notification isVisible={Boolean(content)} onClick={onClick}>
      {content}
    </_Notification>
  );
};
