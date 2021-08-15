const ID_URL = '/id.json';
const CHECK_INTERVAL = 10000;

export async function autoReload(): Promise<void> {
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

    location.reload();
  }, CHECK_INTERVAL);

  const liveId = await getLiveId();
  if (!liveId) return;
  setStoredId(liveId);
}
