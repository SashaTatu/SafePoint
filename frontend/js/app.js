document.addEventListener('DOMContentLoaded', () => {
  const publicKey =
    'BErJ7Fht80zeUpxYZu54CoOTol6ujZoPlEPwmY_yv5bEo6Ut5O1th6R3q1rMkO6PLaF2yOrNqSYvKucvzpyW-Po';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  const overlay = document.getElementById('pushOverlay');
  const allowBtn = document.getElementById('allow');
  const denyBtn = document.getElementById('deny');

  if (
    'Notification' in window &&
    Notification.permission === 'default' &&
    !localStorage.getItem('pushAsked')
  ) {
    overlay.hidden = false;
  }

  allowBtn.addEventListener('click', async () => {
    overlay.hidden = true;
    localStorage.setItem('pushAsked', 'true');

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeUser();
    }
  });

  denyBtn.addEventListener('click', () => {
    overlay.hidden = true;
    localStorage.setItem('pushAsked', 'true');
  });

  async function subscribeUser() {
    const reg = await navigator.serviceWorker.ready;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    await fetch('/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }
});
