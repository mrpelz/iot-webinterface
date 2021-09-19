import { FunctionComponent, createContext } from 'preact';
import { StateUpdater, useContext, useEffect, useState } from 'preact/hooks';
import { useFlags } from './flags.js';

type TSelectedPageContext = {
  selectedPage: number | null;
  setSelectedPage: StateUpdater<number | null>;
};

const SelectedPageContext = createContext<TSelectedPageContext>(
  null as unknown as TSelectedPageContext
);

export const SelectedPageProvider: FunctionComponent = ({ children }) => {
  const { pageOverride } = useFlags();

  const [selectedPage, setSelectedPage] = useState(pageOverride);

  useEffect(() => {
    if (pageOverride === null) return;
    setSelectedPage(pageOverride);
  }, [pageOverride]);

  return (
    <SelectedPageContext.Provider
      value={{
        selectedPage,
        setSelectedPage,
      }}
    >
      {children}
    </SelectedPageContext.Provider>
  );
};

export function useSelectedPage(): number | null {
  return useContext(SelectedPageContext).selectedPage;
}

export function useSetSelectedPage(): StateUpdater<number | null> {
  return useContext(SelectedPageContext).setSelectedPage;
}
