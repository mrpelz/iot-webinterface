const ID_URL = '/id.json';
export const CHECK_INTERVAL = 30000;

export async function autoReload(interval: number): Promise<void> {
  const getStoredId = () => sessionStorage.getItem('id');
  const setStoredId = (id: string) => sessionStorage.setItem('id', id);

  const getLiveId = () =>
    fetch(ID_URL)
      .then((response) => response.json())
      .then(({ id }) => (id as number).toString())
      .catch(() => null);

  setInterval(async () => {
    const storedId = getStoredId();
    const liveId = await getLiveId();

    if (storedId === liveId) return;
    if (liveId === null) return;

    setStoredId(liveId);

    if (!('serviceWorker' in navigator)) {
      location.reload();
    }

    const serviceWorker = await navigator.serviceWorker.ready;
    await serviceWorker.update();

    location.reload();
  }, interval);

  const liveId = await getLiveId();
  if (!liveId) return;
  setStoredId(liveId);
}
