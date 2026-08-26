import { ensureKeys, isPlainObject } from '@mrpelz/misc-utils/oop';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { AnyObject, serialized } from '../../../../api.js';
import { Grid } from '../../../../components/grid.js';
import { useShortenedPath } from '../../../../hooks/use-path.js';
import { useTitleOverride } from '../../../../state/title.js';
import { getTranslationFallback } from '../../../../state/translation.js';
import { Category } from '../../../../views/category.js';
import { Translation } from '../../../../views/translation.js';
import { Control } from '../../../controls/main.js';

export const GroupChildren: FunctionComponent<{
  object: AnyObject;
}> = ({ object }) => {
  const $path = useMemo(
    () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (isPlainObject(object) ? serialized(object).$path : undefined) as
        (string | number)[] | undefined,
    [object],
  );

  const { $ } = ensureKeys(object, '$');
  const name_ = useShortenedPath($path);
  const name = String(name_?.join(' ') ?? $path?.at(-1) ?? $);

  const { inputs } = ensureKeys(object, 'inputs');
  const { outputs } = ensureKeys(object, 'outputs');
  const { lights } = ensureKeys(object, 'lights');

  const children = inputs ?? outputs ?? lights;

  useTitleOverride(children ? getTranslationFallback(name).value : undefined);

  const categorized = useMemo(() => {
    if (!children) return undefined;

    const result: Record<
      string,
      Exclude<typeof children, undefined>[number][]
    > = {};

    for (const child of children) {
      const group = serialized(child).$path?.at(-2);
      if (group === undefined) continue;

      result[group] = result[group] ?? [];
      result[group].push(child);
    }

    return result;
  }, [children]);

  if (!categorized) return null;

  return Object.entries(categorized).map(([key, items]) => (
    <Category
      key={key}
      header={
        <Translation
          capitalize={true}
          i18nKey={key}
        />
      }
    >
      <Grid>
        {items.map((item_) => {
          const child = serialized(item_);

          return (
            <Control
              key={child.$id}
              object={item_}
            />
          );
        })}
      </Grid>
    </Category>
  ));
};
