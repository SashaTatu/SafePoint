const publicKey = 'BErJ7Fht80zeUpxYZu54CoOTol6ujZoPlEPwmY_yv5bEo6Ut5O1th6R3q1rMkO6PLaF2yOrNqSYvKucvzpyW-Po';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// modal
const modal = document.getElementById('pushModal');
const allow = document.getElementById('allow');
const deny = document.getElementById('deny');

// показуємо ТІЛЬКИ 1 раз
if (
  Notification.permission === 'default' &&
  !localStorage.getItem('pushAsked')
) {
  modal.hidden = false;
}

// дозвіл
allow.onclick = async () => {
  const permission = await Notification.requestPermission();
  localStorage.setItem('pushAsked', 'true');
  modal.hidden = true;

  if (permission === 'granted') {
    subscribeUser();
  }
};

deny.onclick = () => {
  localStorage.setItem('pushAsked', 'true');
  modal.hidden = true;
};

// підписка
async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey
  });

  await fetch('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub)
  });
}
