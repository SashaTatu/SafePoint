const API_URL =  "https://safepoint-bei0.onrender.com";
const avatar = document.getElementById('user-avatar');
const menu = document.getElementById('user-menu');
const logoutBtn = document.getElementById('logout-btn');
const nextButton = document.getElementById('nextButton');
const sensorBtn = document.getElementById('sensor-btn');
const acessBtn = document.getElementById('acess-btn');
const acesscontainer = document.querySelector('.alert-container');
const sensorWrapper = document.querySelector('.sensor-wrapper');
const Listcontainer = document.querySelector('.list-container');
const listBtn = document.getElementById('list-btn');
const doorBtn   = document.getElementById("door-btn");
const saveProfileButton = document.getElementById('save-profile');



sensorBtn.addEventListener('click', () => {
  sensorBtn.classList.toggle('active');
  sensorWrapper.style.display = sensorBtn.classList.contains('active') ? 'flex' : 'none';
  acesscontainer.style.display = sensorBtn.classList.contains('active') ? 'none' : 'block';
  Listcontainer.style.display = sensorBtn.classList.contains('active') ? 'none' : 'flex';
});

acessBtn.addEventListener('click', () => {
  acessBtn.classList.toggle('active');
  acesscontainer.style.display = acessBtn.classList.contains('active') ? 'block' : 'none';
  sensorWrapper.style.display = acessBtn.classList.contains('active') ? 'none' : 'flex';
  Listcontainer.style.display = acessBtn.classList.contains('active') ? 'none' : 'flex'; 
});

listBtn.addEventListener('click', () => {
  listBtn.classList.toggle('active');
  Listcontainer.style.display = listBtn.classList.contains('active') ? 'flex' : 'none';
  sensorWrapper.style.display = listBtn.classList.contains('active') ? 'none' : 'flex';
  acesscontainer.style.display = listBtn.classList.contains('active') ? 'none' : 'block'; 
})



const deviceId = window.location.pathname.split("/")[2];

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


const buttons = document.querySelectorAll(".footer-nav .nav-btn");
const activeBg = document.querySelector(".footer-nav .active-bg");


fetchSensorData(deviceId);

setInterval(() => fetchSensorData(deviceId), 60000);





checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark', checkbox.checked);
});

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const index = btn.dataset.index;

    // рух капсули
    const buttonRect = btn.getBoundingClientRect();
    const navRect = document.querySelector(".footer-nav").getBoundingClientRect();
    const offset = buttonRect.left - navRect.left;

    activeBg.style.left = offset + "px";

    // виділення кнопки
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});


async function fetchSensorData(deviceId) {
    try {
        const response = await fetch(`/api/device/${deviceId}/parametersget`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const json = await response.json();

        if (!json.success) {
            throw new Error(json.message || "Unknown error");
        }

        const sensorData = json.data[0]; 

        document.getElementById("temperature").textContent = sensorData.temperature ?? "--";
        document.getElementById("humidity").textContent = sensorData.humidity ?? "--";
        document.getElementById("co2").textContent = sensorData.co2 ?? "--";

    } catch (err) {
        console.error("Error fetching sensor data:", err);
    }
}

fetchSensorData(deviceId);

setInterval(() => fetchSensorData(deviceId), 60000);


avatar.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
  if (!avatar.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
  }
});

document.getElementById("edit-profile-btn").addEventListener("click", () => {
  fetchUser();
  document.getElementById("editModal").style.display = "flex";
});

// Закрити модальне вікно при кліку поза ним
window.addEventListener("click", (e) => {
  const modal = document.getElementById("editModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert('✅ Ви успішно вийшли з системи');
      window.location.href = '../enter.html';
    } else {
      alert('❌ Помилка: ' + (data.message || 'Невідома помилка'));
    }
  } catch (error) {
    console.error('❌ Помилка запиту:', error);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});



checkbox.addEventListener('change', () => {
  document.body.classList.toggle('dark', checkbox.checked);
});



async function fetchUser() {
  try {
    const res = await fetch(`${API_URL}/api/auth/getuser`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await res.json();

    if (res.ok && data.success) {

      document.getElementById("name").value = data.data.name;
      document.getElementById("region").value = data.data.region;
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
  }
}

async function fetchDeviceAlert(deviceId) {
  try {
    const response = await fetch(`/api/device/${deviceId}/isalert`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Network response was not ok -> alert");

    const json = await response.json();
    console.log("ALERT RESPONSE:", json);

    if (!json.success) throw new Error(json.message || "Unknown error");

    const alertElem = document.getElementById("alert-status");
    const doorElem  = document.getElementById("door-status");
    const lockImg   = document.getElementById("lock-img");

    const isAlert = Boolean(json.alert);
    const isLocked = json.status === "Зачинено";

    // 🔥 Статус тривоги
    alertElem.textContent = isAlert ? "Активна" : "Відсутня";
    alertElem.style.color = isAlert ? "#FF6B6B" : "#6BCB77";

    // 🔥 Якщо є тривога — блокуємо кнопку
    if (isAlert) {
      doorBtn.textContent = "Недоступно під час тривоги";
      doorBtn.disabled = true;
      doorBtn.style.cursor = "not-allowed";
    }

    // 🔥 Оновлюємо стан дверей
    if (isLocked) {
      doorElem.textContent = "Зачинено";
      doorElem.style.color = "#030303ff";
      lockImg.src = "/assets/img-device/lock.png";

      if (!isAlert) {
        doorBtn.textContent = "Відчинити двері";
        doorBtn.disabled = false;
        doorBtn.style.cursor = "pointer";
      }

    } else {
      doorElem.textContent = "Відчинено";
      doorElem.style.color = "#6BCB77";
      lockImg.src = "/assets/img-device/unlock.png";

      if (!isAlert) {
        doorBtn.textContent = "Зачинити двері";
        doorBtn.disabled = false;
        doorBtn.style.cursor = "pointer";
      }
    }

  } catch (err) {
    console.error("Error fetching sensor data:", err);
  }
}

fetchDeviceAlert(deviceId);
setInterval(() => fetchDeviceAlert(deviceId), 30000);


async function updateDoorStatus(deviceId, doorBtn) {
  if (doorBtn.disabled) return;
  doorBtn.disabled = true;

  try {
    const response = await fetch(`/api/device/${deviceId}/updatedoorstatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Network response was not ok -> door update");

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Unknown error");

    await fetchDeviceAlert(deviceId);

  } catch (err) {
    console.error(err);
  } finally {
    doorBtn.disabled = false;
  }
}

doorBtn.addEventListener("click", () => {
  updateDoorStatus(deviceId, doorBtn);
});



saveProfileButton.addEventListener('click', async () => {
  const name = document.getElementById("name").value.trim();
  const region = document.getElementById("region").value;
  try {
    const res = await fetch(`${API_URL}/api/user/change-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, region }),
      credentials: 'include'
    });
    const data = await res.json();

    if (res.ok && data.success) {
      alert('✅ Інформацію оновлено успішно');
      document.getElementById("editModal").style.display = "none";
      generateAvatar(name);
    } else {
      alert('❌ Помилка: ' + (data.error || data.message || 'Невідома помилка'));
    }
  } catch (err) {
    console.error('❌ Помилка запиту:', err);
    alert('❌ Сервер недоступний або сталася помилка');
  }
});

