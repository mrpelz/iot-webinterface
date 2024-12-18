import { styled } from 'goober';
import { ComponentChild, createContext, FunctionComponent, JSX } from 'preact';
import type { TargetedEvent } from 'preact/compat';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

import { useRerender } from '../hooks/use-rerender.js';
import { useSymbol } from '../hooks/use-symbol.js';
import { dimensions } from '../style.js';

const DetailsComponent = styled('details')`
  display: flex;
  flex-direction: column;
  font-family: monospace;
  position: relative;
`;

// eslint-disable-next-line prettier/prettier
const SummaryComponent = styled<{ collapsible: boolean, showExpandIcon: boolean } & JSX.DOMAttributes<HTMLElement>>('summary')`
  cursor: ${({ collapsible }) => (collapsible ? 'zoom-in' : 'initial')};
  display: block;
  pointer-events: ${({ collapsible }) => (collapsible ? 'all' : 'none')};
  position: ${({ collapsible, showExpandIcon }) =>
    collapsible && showExpandIcon ? 'relative' : 'static'};

  details[open] > & {
    cursor: ${({ collapsible }) => (collapsible ? 'zoom-out' : 'initial')};
  }

  &::after {
    content: '+';
    display: ${({ collapsible, showExpandIcon }) =>
      collapsible && showExpandIcon ? 'block' : 'none'};
    inset-block: 0;
    position: absolute;
    translate: calc(-100% - 0.5ch);
  }

  details[open] > &::after {
    content: '-';
  }
`;

const CollapseAll = styled('div')`
  cursor: pointer;
  font-size: ${dimensions.fontSizeSmall};
  inset-block-start: 0;
  inset-inline-start: 0;
  padding-inline: 0.5ch;
  position: absolute;
  translate: calc(-100%) 1lh;
  visibility: hidden;

  &::before {
    content: '-';
  }

  details[open] > & {
    visibility: visible;
  }
`;

const ExpandAll = styled(CollapseAll)`
  translate: calc(-100%) 2lh;

  &::before {
    content: '+';
  }
`;

const HideWhenCollapsed = styled('span')`
  display: none;

  details[open] > &,
  details[open] > summary > & {
    display: contents;
  }
`;

const HideWhenExpanded = styled('span')`
  display: contents;

  details[open] > &,
  details[open] > summary > & {
    display: none;
  }
`;

type TDetailsContext =
  | {
      collapseAll?: symbol;
      expandAll?: symbol;
      isOpen?: boolean;
    }
  | undefined;
const DetailsContext = createContext<TDetailsContext>(undefined);

export const useIsOpen = (): boolean | undefined =>
  useContext(DetailsContext)?.isOpen;

export const Inset = styled<{ inset?: number }>('inset' as 'span')`
  display: flow-root;
  margin-inline-start: ${({ inset = 2 }) => inset}ch;
`;

export const Details: FunctionComponent<{
  collapsible?: boolean;
  handleToggle?: (open: boolean) => void;
  open?: boolean;
  showExpandIcon?: boolean;
  summary?: ComponentChild;
  summaryExpanded?: ComponentChild;
}> = ({
  children,
  collapsible = true,
  handleToggle,
  open: initiallyOpen = false,
  showExpandIcon = true,
  summary,
  summaryExpanded = null,
}) => {
  const parentContext = useContext(DetailsContext);

  const parentCollapseAll = parentContext?.collapseAll;
  const [collapseAll, triggerCollapseAll] = useRerender('collapseAll');

  const parentExpandAll = parentContext?.expandAll;
  const [expandAll, triggerExpandAll] = useRerender('expandAll');

  const parentOpen = parentContext?.isOpen;
  const [isOpen, setOpen] = useState<boolean | undefined>(
    collapsible ? initiallyOpen && parentOpen : true,
  );

  const onToggle = useCallback<
    JSX.EventHandler<TargetedEvent<HTMLDetailsElement, ToggleEvent>>
  >(
    ({ newState }) => {
      if (!collapsible) {
        setOpen(true);

        return;
      }

      if (newState === 'open') setOpen(true);
      if (newState === 'closed') setOpen(false);
    },
    [collapsible],
  );

  const onExpandAllClick = useCallback<JSX.MouseEventHandler<HTMLElement>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      triggerExpandAll();
    },
    [triggerExpandAll],
  );

  const onCollapseAllClick = useCallback<JSX.MouseEventHandler<HTMLElement>>(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      triggerCollapseAll();
    },
    [triggerCollapseAll],
  );

  useEffect(() => {
    if (!parentOpen) setOpen(false);
    return () => setOpen(undefined);
  }, [parentOpen]);

  useEffect(() => {
    if (parentExpandAll) setOpen(true);
  }, [parentExpandAll]);

  useEffect(() => {
    if (parentCollapseAll) setOpen(false);
  }, [parentCollapseAll]);

  useEffect(() => {
    handleToggle?.(Boolean(isOpen));
  }, [handleToggle, isOpen]);

  return (
    <DetailsContext.Provider
      value={useMemo(
        () => ({
          collapseAll,
          expandAll,
          isOpen,
        }),
        [collapseAll, expandAll, isOpen],
      )}
    >
      <DetailsComponent open={isOpen} onToggle={onToggle}>
        <SummaryComponent
          collapsible={collapsible}
          showExpandIcon={showExpandIcon}
        >
          {summaryExpanded ? (
            <>
              <HideWhenExpanded>{summary}</HideWhenExpanded>
              <HideWhenCollapsed>{summaryExpanded}</HideWhenCollapsed>
            </>
          ) : (
            summary
          )}
        </SummaryComponent>
        {children}
        <CollapseAll onClick={onCollapseAllClick} />
        <ExpandAll onClick={onExpandAllClick} />
      </DetailsComponent>
    </DetailsContext.Provider>
  );
};
