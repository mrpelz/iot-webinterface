export const persist = async (): Promise<void> => {
  try {
    if ('storage' in navigator) {
      if (
        'persisted' in navigator.storage &&
        (await navigator.storage.persisted())
      ) {
        return;
      }

      if ('persist' in navigator.storage) {
        await navigator.storage.persist();
      }
    }
  } catch {
    // noop
  }
};
