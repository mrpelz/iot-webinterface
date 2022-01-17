import { FunctionComponent } from 'preact';
import { Notification as NotificationComponent } from '../components/notification.js';
import { useNotification } from '../state/notification.js';

export type TNotification = {
  content: string | null;
  onClick?: () => void;
  onDismiss?: () => void;
};

export const Notification: FunctionComponent = () => {
  const fallbackNotification = useNotification();

  const onClick = fallbackNotification?.onClick;
  const title = fallbackNotification?.title;
  const body = fallbackNotification?.body;

  return (
    <NotificationComponent
      isVisible={Boolean(fallbackNotification)}
      onClick={onClick}
    >
      {title ? <b>{title}</b> : null}
      <br />
      {body ? <i>{body}</i> : null}
    </NotificationComponent>
  );
};
