import {
  DismissButton,
  Notification as NotificationComponent,
} from '../components/notification.js';
import { FunctionComponent } from 'preact';
import { useNotification } from '../state/notification.js';

export type TNotification = {
  content: string | null;
  onClick?: () => void;
  onDismiss?: () => void;
};

export const Notification: FunctionComponent = () => {
  const fallbackNotification = useNotification();

  const onClick = fallbackNotification?.onClick;
  const onDismiss = fallbackNotification?.onDismiss;
  const title = fallbackNotification?.title;
  const body = fallbackNotification?.body;

  return (
    <NotificationComponent
      isVisible={Boolean(fallbackNotification)}
      onClick={onClick}
    >
      <section>
        {title ? <b>{title}</b> : null}
        <br />
        {body ? <i>{body}</i> : null}
      </section>
      <DismissButton onClick={onDismiss}>✕</DismissButton>
    </NotificationComponent>
  );
};
