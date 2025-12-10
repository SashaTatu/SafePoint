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



async function fetchDoorData(deviceId) {
    try {
        const response = await fetch(`/api/device/${deviceId}/doorstatus`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const json = await response.json();
        console.log("DOOR RESPONSE:", json); // ДОДАЙ ЩОБ ПОБАЧИТИ ТОЧНИЙ ФОРМАТ

        if (!json.success) {
            throw new Error(json.message || "Unknown error");
        }

        let isOpen = "--";

        
        if (typeof json.isOpen !== "undefined") {
            isOpen = json.isOpen ? "Відчинено" : "Зачинено";
        }

        else if (Array.isArray(json.data) && json.data.length > 0) {
            isOpen = json.data[0].isOpen ? "Відчинено" : "Зачинено";
        }

        document.getElementById("door-status").textContent = isOpen;

    } catch (err) {
        console.error("Error fetching door data:", err);
    }
}

fetchDoorData(deviceId);
setInterval(() => fetchDoorData(deviceId), 60000);


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

        if (!response.ok) {
            throw new Error("Network response was not ok -> alert");
        }

        const json = await response.json();
        console.log("ALERT RESPONSE:", json);

        if (!json.success) {
            throw new Error(json.message || "Unknown error");
        }

        const AlertData = Boolean(json.alert);

        // Статус тривоги
        document.getElementById("alert-status").textContent =
            AlertData ? "Активна" : "Відсутня";

        // Статус дверей — повторює тривогу
        const doorState = AlertData; // true = Відчинено, false = Зачинено
        document.getElementById("door-status").textContent =
            doorState ? "Відчинено" : "Зачинено";

        // ---- ВІДПРАВЛЯЄМО НА БЕКЕНД, щоб зберегти в БД ----
        await fetch(`${API_URL}/api/device/${deviceId}/updatedoorstatus`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status: doorState })
        });

    } catch (err) {
        console.error("Error fetching sensor data:", err);
    }
}

// Запускаємо та оновлюємо кожні 2 хвилини
fetchDeviceAlert(deviceId);
setInterval(() => fetchDeviceAlert(deviceId), 60000);






