const userAgent = navigator.userAgent.toLowerCase();

export const isSafari = (() => {
  if (!userAgent.includes('safari')) return false;
  if (userAgent.includes('chrome')) return false;
  if (userAgent.includes('chromium')) return false;
  if (userAgent.includes('android')) return false;
  if (userAgent.includes('edg')) return false;
  if (userAgent.includes('opr')) return false;
  if (userAgent.includes('firefox')) return false;

  return true;
})();

export const isiPhone = isSafari && userAgent.includes('iphone');

export const isiPad =
  isSafari &&
  (userAgent.includes('ipad') ||
    (!isiPhone && Boolean(navigator.maxTouchPoints)));

export const isiDevice = isiPhone || isiPad;

export const isPWA =
  window.matchMedia('(display-mode: standalone)').matches ||
  ('standalone' in navigator && navigator.standalone) ||
  document.referrer.startsWith('android-app://');
