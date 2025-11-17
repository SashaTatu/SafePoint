const API_URL =  "https://safepoint-bei0.onrender.com";


async function UserNameGet() {
  try {
    const res = await fetch(`${API_URL}/api/user/data`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {
      generateAvatar(data.userData.name);
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
}

function generateAvatar(userName) {
  const avatar = document.getElementById("user-avatar");

  const colors = [
    "#FF6B6B", "#6BCB77", "#4D96FF", "#FFD93D", "#845EC2",
    "#00C9A7", "#FF9671", "#FFC75F", "#F9F871", "#0081CF"
  ];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const initial = userName ? userName.trim()[0].toUpperCase() : "?";

  avatar.style.backgroundColor = bgColor;
  avatar.textContent = initial;
}


UserNameGet();