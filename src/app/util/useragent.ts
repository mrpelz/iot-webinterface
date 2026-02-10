export const isSafari = (() => {
  const { userAgent } = navigator;

  if (!userAgent.includes('Safari')) return false;
  if (userAgent.includes('Chrome')) return false;
  if (userAgent.includes('Chromium')) return false;
  if (userAgent.includes('Android')) return false;
  if (userAgent.includes('Edg')) return false;
  if (userAgent.includes('OPR')) return false;
  if (userAgent.includes('Firefox')) return false;

  return true;
})();
