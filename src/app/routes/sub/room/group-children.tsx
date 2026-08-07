import { TSystem } from '@iot/iot-monolith';
import { Match, TExclude } from '@iot/iot-monolith/tree';
import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import { serialized } from '../../../api.js';
import { Grid } from '../../../components/grid.js';
import { Control } from '../../../controls/main.js';
import { useTitleOverride } from '../../../state/title.js';
import { getTranslationFallback } from '../../../state/translation.js';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type TInputGroupingSensor = Match<
  {
    $: 'inputGrouping';
  },
  TExclude,
  TSystem
>;

export const GroupChildren: FunctionComponent<{
  sensor: TInputGroupingSensor;
}> = ({ sensor }) => {
  const name = useMemo(
    () => String(serialized(sensor).$path?.at(-1) ?? ''),
    [sensor],
  );

  const { $, inputs } = sensor;

  useTitleOverride(getTranslationFallback(name ?? $).value);

  return (
    <Grid>
      {inputs.map((input_) => {
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
