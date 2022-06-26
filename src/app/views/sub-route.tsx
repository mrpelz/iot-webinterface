import { ComponentChildren, FunctionComponent } from 'preact';
import { ShowHide } from '../components/show-hide.js';
import { useScrollRestore } from '../hooks/use-scroll-restore.js';

export const SubRoute: FunctionComponent<{ subRoute: ComponentChildren }> = ({
  children,
  subRoute,
}) => {
  useScrollRestore(!subRoute);

  return (
    <>
      <ShowHide show={!subRoute}>{children}</ShowHide>
      {subRoute}
    </>
  );
};
