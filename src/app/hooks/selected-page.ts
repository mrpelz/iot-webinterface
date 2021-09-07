import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { Flags } from '../util/flags.js';
import { createContext } from 'preact';

type TSelectedPageContext = {
  selectedPage: number | null;
  setSelectedPage: StateUpdater<number | null>;
};

export const SelectedPageContext = createContext<TSelectedPageContext>(
  null as unknown as TSelectedPageContext
);

export function useInitSelectedPage(
  flags: Flags,
  initialPage: number | null = null
): TSelectedPageContext {
  const { pageOverride } = flags;

  const [selectedPage, setSelectedPage] = useState(pageOverride || initialPage);
  useEffect(() => {
    if (pageOverride === null) return;
    setSelectedPage(pageOverride);
  }, [pageOverride]);

  return {
    selectedPage,
    setSelectedPage,
  };
}

export function useSelectedPage(): number | null {
  return useContext(SelectedPageContext).selectedPage;
}

export function useSetSelectedPage(): StateUpdater<number | null> {
  return useContext(SelectedPageContext).setSelectedPage;
}
