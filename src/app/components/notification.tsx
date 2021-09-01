import { FunctionComponent } from 'preact';
import { color } from '../style/colors.js';
import { dependentValue } from '../style/main.js';
import { dimension } from '../style/dimensions.js';
import { styled } from 'goober';
import { useNotification } from '../hooks/notification.js';

export type Notification = {
  content: string | null;
  onClick?: () => void;
  onDismiss?: () => void;
};

const _Notification = styled('section')<{ isVisible: boolean }>`
  cursor: ${dependentValue('onClick', 'pointer', 'default')};
  height: ${dependentValue('isVisible', dimension('titlebarHeight'), '0')};
  overflow: hidden;
  transition: background-color 0.3s ease-out, height 0.3s ease-out;

  background-color: ${dependentValue(
    'isVisible',
    color('selection'),
    'rgba(0, 0, 0, 0)'
  )};
`;

export const Notification: FunctionComponent = () => {
  const fallbackNotification = useNotification();

  const onClick = fallbackNotification?.onClick;
  const title = fallbackNotification?.title;
  const body = fallbackNotification?.body;

  return (
    <_Notification isVisible={Boolean(fallbackNotification)} onClick={onClick}>
      {title ? <b>{title}</b> : null}
      <br />
      {body ? <i>{body}</i> : null}
    </_Notification>
  );
};
