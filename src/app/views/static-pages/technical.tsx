import { Grid, GridCell } from '../../components/grid.js';
import {
  HierarchyElementDevice,
  HierarchyElementRoom,
  Levels,
  sortByName,
} from '../../web-api.js';
import { useDeepLevel, useGetter, useHierarchy } from '../../state/web-api.js';
import { Category } from '../../components/category.js';
import { DiagnosticsContainer } from '../../components/diagnostics.js';
import { FunctionComponent } from 'preact';
import { Hierarchy } from './diagnostics.js';
import { OnlineOffline } from '../../components/technical.js';
import { rooms } from '../../i18n/sorting.js';
import { useArray } from '../../util/array-compare.js';
import { useI18nKeyFallback } from '../../state/i18n.js';
import { useMemo } from 'preact/hooks';

const Device: FunctionComponent<{ element: HierarchyElementDevice }> = ({
  element,
}) => {
  const isConnected = useGetter(element.children?.online);
  const child = useMemo(() => <Hierarchy element={element} />, [element]);

  return (
    <DiagnosticsContainer>
      {typeof isConnected === 'boolean' ? (
        <OnlineOffline isConnected={isConnected}>{child}</OnlineOffline>
      ) : (
        child
      )}
    </DiagnosticsContainer>
  );
};

const Room: FunctionComponent<{ element: HierarchyElementRoom }> = ({
  element,
}) => {
  const {
    meta: { name },
  } = element;

  const elements = useDeepLevel<HierarchyElementDevice>(Levels.DEVICE, element);

  return (
    <Category header={useI18nKeyFallback(name)}>
      <Grid>
        {useMemo(
          () =>
            elements.map((device) => (
              <GridCell span={3}>
                <Device element={device} />
              </GridCell>
            )),
          [elements]
        )}
      </Grid>
    </Category>
  );
};

export const Technical: FunctionComponent = () => {
  const hierarchy = useHierarchy();

  const elements = useDeepLevel<HierarchyElementRoom>(Levels.ROOM, hierarchy);
  const sortedElements = useArray(
    useMemo(() => sortByName(elements, rooms), [elements])
  );

  return useMemo(
    () => (
      <>
        {sortedElements.map((room) => (
          <Room element={room} />
        ))}
      </>
    ),
    [sortedElements]
  );
};
