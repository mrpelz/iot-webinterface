import { ensureKeys } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { AnyObject, serialized } from '../../../api.js';
import { Grid } from '../../../components/grid.js';
import { Control } from '../../../controls/main.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslationFallback } from '../../../state/translation.js';

export const GroupChildren: FunctionComponent<{
  object: AnyObject;
}> = ({ object }) => {
  const name = useMemo(
    () =>
      String(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        serialized(Array.isArray(object) ? {} : object).$path?.at(-1) ?? '',
      ),
    [object],
  );

  const { $ } = ensureKeys(object, '$');
  const { inputs } = ensureKeys(object, 'inputs');
  const { outputs } = ensureKeys(object, 'outputs');
  const { lights } = ensureKeys(object, 'lights');

  const children = inputs ?? outputs ?? lights;

  useTitleOverride(
    children ? getTranslationFallback(name ?? $).value : undefined,
  );

  if (!children) return null;

  return (
    <Grid>
      {children.map((input_) => {
        const input = serialized(input_);

        return (
          <Control
            key={input.$id}
            object={input_}
          />
        );
      })}
    </Grid>
  );
};
