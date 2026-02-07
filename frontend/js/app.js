async function subscribeUser() {
  const reg = await navigator.serviceWorker.ready;

  let subscription = await reg.pushManager.getSubscription();

  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
  }

  await fetch('/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });
}

window.subscribeUser = subscribeUser;
