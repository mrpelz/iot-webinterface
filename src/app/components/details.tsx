import { styled } from 'goober';
import { ComponentChild, createContext, FunctionComponent, JSX } from 'preact';
import { forwardRef, type TargetedEvent } from 'preact/compat';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';

import { useRerender } from '../hooks/use-rerender.js';
import { dimensions } from '../style.js';

const DetailsComponent = styled('details', forwardRef)`
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
    aspect-ratio: 1;
    border: solid ${dimensions.hairline} currentColor;
    content: '+' / 'expand';
    display: ${({ collapsible, showExpandIcon }) =>
      collapsible && showExpandIcon ? 'block' : 'none'};
    block-size: 1lh;
    font-size: ${dimensions.fontSizeSmall};
    inset-block: 0;
    position: absolute;
    text-align: center;
    translate: -100%;
  }

  details[open] > &::after {
    content: '-' / 'collapse';
  }
`;

const CollapseAll = styled('div')`
  aspect-ratio: 1;
  block-size: 1lh;
  border: solid ${dimensions.hairline} currentColor;
  cursor: pointer;
  font-size: ${dimensions.fontSizeSmall};
  inset-block-start: 0;
  inset-inline-start: 0;
  position: absolute;
  text-align: center;
  translate: -100% calc(1lh + ${dimensions.hairline});
  visibility: hidden;

  &::before {
    content: '--' / 'collapse all';
  }

  details[open] > & {
    visibility: visible;
  }
`;

const ExpandAllSingle = styled(CollapseAll)`
  &::before {
    content: '++' / 'expand all';
  }
`;

const ExpandAll = styled(ExpandAllSingle)`
  translate: -100% 2lh;
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
      childCollapseExpandTrigger: () => void;
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
  showCollapseExpandAllIcon?: boolean;
  showExpandIcon?: boolean;
  summary?: ComponentChild;
  summaryExpanded?: ComponentChild;
}> = ({
  children,
  collapsible = true,
  handleToggle,
  open: initiallyOpen = false,
  showCollapseExpandAllIcon = true,
  showExpandIcon = true,
  summary,
  summaryExpanded = null,
}) => {
  const parentContext = useContext(DetailsContext);

  const parentChildCollapseExpandTrigger =
    parentContext?.childCollapseExpandTrigger;
  const [childCollapseExpand, childCollapseExpandTrigger] = useRerender(
    'childCollapseExpandTrigger',
  );

  const parentCollapseAll = parentContext?.collapseAll;
  const [collapseAll, triggerCollapseAll] = useRerender('collapseAll');

  const parentExpandAll = parentContext?.expandAll;
  const [expandAll, triggerExpandAll] = useRerender('expandAll');

  const parentOpen = parentContext?.isOpen;
  const [isOpen, setOpen] = useState<boolean | undefined>(
    collapsible ? initiallyOpen && parentOpen : true,
  );

  const [isCollapsible, setCollapsible] = useState(false);
  const [isExpandable, setExpandable] = useState(false);

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
    if (!parentExpandAll) return;
    setOpen(true);
  }, [parentExpandAll]);

  useEffect(() => {
    if (!parentCollapseAll) return;
    setOpen(false);
  }, [parentCollapseAll]);

  useEffect(() => {
    parentChildCollapseExpandTrigger?.();
    handleToggle?.(Boolean(isOpen));
  }, [handleToggle, isOpen, parentChildCollapseExpandTrigger]);

  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const { current: element } = ref;
    if (!element) return;

    const directChildren = Array.from(
      element.querySelectorAll('details'),
    ).filter((child) =>
      child.parentElement?.closest('details')?.isSameNode(element),
    );

    const directChildrenOpen = directChildren.filter((child) =>
      child.matches('[open]'),
    );

    setCollapsible(directChildren.length > 1 && directChildrenOpen.length > 0);
    setExpandable(
      directChildren.length > 1 &&
        directChildren.length > directChildrenOpen.length,
    );
  }, [childCollapseExpand, isOpen]);

  return (
    <DetailsContext.Provider
      value={useMemo(
        () => ({
          childCollapseExpandTrigger,
          collapseAll,
          expandAll,
          isOpen,
        }),
        [childCollapseExpandTrigger, collapseAll, expandAll, isOpen],
      )}
    >
      <DetailsComponent
        onToggle={onToggle}
        open={isOpen}
        ref={ref}
        title={isOpen ? undefined : 'expand'}
      >
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
        {showCollapseExpandAllIcon ? (
          <>
            {isCollapsible ? (
              <CollapseAll onClick={onCollapseAllClick} title="collapse all" />
            ) : null}
            {
              // eslint-disable-next-line no-nested-ternary
              isExpandable ? (
                isCollapsible ? (
                  <ExpandAll onClick={onExpandAllClick} title="expand all" />
                ) : (
                  <ExpandAllSingle
                    onClick={onExpandAllClick}
                    title="expand all"
                  />
                )
              ) : null
            }
          </>
        ) : null}
        {children}
      </DetailsComponent>
    </DetailsContext.Provider>
  );
};
