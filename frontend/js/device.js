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
const returnBtn = document.getElementById('return_btn');
const refreshDataBtn = document.getElementById('refresh-data');



let sensorIntervalId = null;
let currentAlertState = null;



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




function updateSensorColors() {
    const lines = document.querySelectorAll('.sensor-line');

    lines.forEach(line => {
        const valueSpan = line.querySelector('.sensor-value');
        if (!valueSpan || valueSpan.textContent === "--") return;

        const value = parseFloat(valueSpan.textContent);
        const { warnMin, warnMax, dangerMin, dangerMax } = line.dataset;

        let status = 'status-ok';

        // Логіка Danger
        if ((dangerMax && value >= parseFloat(dangerMax)) || 
            (dangerMin && value <= parseFloat(dangerMin))) {
            status = 'status-danger';
        } 
        // Логіка Warning
        else if ((warnMax && value >= parseFloat(warnMax)) || 
                 (warnMin && value <= parseFloat(warnMin))) {
            status = 'status-warn';
        }

        line.classList.remove('status-ok', 'status-warn', 'status-danger');
        line.classList.add(status);
    });
}



async function fetchSensorData(deviceId) {
    try {
        const response = await fetch(`/api/device/${deviceId}/parametersget`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Network response was not ok");

        const json = await response.json();
        if (!json.success) throw new Error(json.message || "Unknown error");

        const sensorData = json.data[0]; 

        // Оновлюємо текст
        document.getElementById("temperature").textContent = sensorData.temperature ?? "--";
        document.getElementById("humidity").textContent = sensorData.humidity ?? "--";
        document.getElementById("co2").textContent = sensorData.co2 ?? "--";

        // 🔥 ВАЖЛИВО: Оновлюємо кольори відразу після вставки тексту
        updateSensorColors(sensorData.co2, sensorData.temperature, sensorData.humidity);

    } catch (err) {
        console.error("Error fetching sensor data:", err);
    }
}


function startSensorPolling(deviceId, isAlert) {
    if (sensorIntervalId) clearInterval(sensorIntervalId);

    const delay = isAlert ? 30000 : 600000;
    console.log(`Polling sensors every ${delay/1000}s`);
    

    fetchSensorData(deviceId);
    sensorIntervalId = setInterval(() => fetchSensorData(deviceId), delay);
}

startSensorPolling(deviceId, false); // Початковий виклик з isAlert = false

refreshDataBtn.addEventListener("click", () => fetchSensorData(deviceId));



// Функція, яка спрацьовує при натисканні на рядок показника
async function openChartFor(category, label) {
    const deviceId = window.location.pathname.split('/').pop(); // Отримуємо ID з URL
    const btn = document.querySelector('.refresh-btn');
    
    try {
        // 1. Запитуємо історію з сервера
        const response = await fetch(`/api/device/${deviceId}/history`);
        const json = await response.json();

        if (!json.success) throw new Error("Не вдалося завантажити історію");

        // 2. Форматуємо дані для Chart.js
        const historyData = json.data.map(log => ({
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: log[category] // беремо 'temperature', 'humidity' або 'co2'
        }));

        // 3. Відкриваємо модалку та малюємо
        showChartModal(historyData, label);

    } catch (err) {
        console.error("Помилка графіка:", err);
        alert("Не вдалося отримати дані для графіка");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Температура
    document.getElementById('temperature').closest('.sensor-line').addEventListener('click', () => {
        openChartFor('temperature', 'Температура (°C)');
    });

    // Вологість
    document.getElementById('humidity').closest('.sensor-line').addEventListener('click', () => {
        openChartFor('humidity', 'Вологість (%)');
    });

    // CO2
    document.getElementById('co2').closest('.sensor-line').addEventListener('click', () => {
        openChartFor('co2', 'Рівень CO₂ (ppm)');
    });
});

// Функція закриття (додай до кнопки "Закрити")

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
    if (!json.success) throw new Error(json.message || "Unknown error");

    const alertElem = document.getElementById("alert-status");
    const doorElem  = document.getElementById("door-status");
    const lockImg   = document.getElementById("lock-img");

    const isAlert  = Boolean(json.alert);
    const isLocked = Boolean(json.status);

    alertElem.textContent = isAlert ? "Активна" : "Відсутня";
    alertElem.style.color = isAlert ? "#FF6B6B" : "#6BCB77";

    doorElem.textContent = isLocked ?  "Відчинено" : "Зачинено";
    doorElem.style.color = isLocked ? "#6BCB77" : "#000000ff";
    lockImg.src = isLocked 
      ? "/assets/img-device/unlock.png" 
      : "/assets/img-device/lock.png";

    if (isAlert) {
      doorBtn.textContent = "Недоступно під час тривоги";
      doorBtn.disabled = true;
      doorBtn.style.cursor = "not-allowed";
    } else {
      doorBtn.disabled = false;
      doorBtn.style.cursor = "pointer";
      doorBtn.textContent = isLocked ? "Зачинити двері" : "Відчинити двері";
    }

    fetchDeviceAlert(deviceId);

  } catch (err) {
    console.error("Error fetching sensor data:", err);
  }
}

fetchDeviceAlert(deviceId);
setInterval(() => fetchDeviceAlert(deviceId), 120001);


async function updateDoorStatus(deviceId) {
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

    fetchDeviceAlert(deviceId);

  } catch (err) {
    console.error(err);
  }
}
///

doorBtn.addEventListener("click", () => updateDoorStatus(deviceId, doorBtn));



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

returnBtn.addEventListener('click', () => {
    // Використовуємо origin, щоб автоматично підставити домен
    window.location.href = window.location.origin + '/index.html';
});


// 1. Обов'язково оголошуємо глобальну змінну для графіка на самому початку
let myChart = null;

// Функція, яка спрацьовує при кліку на показник
async function openChartFor(category, label) {
    const deviceId = window.location.pathname.split('/').pop();
    const modal = document.getElementById('chart-modal');
    
    if (!modal) return;
    modal.style.display = 'flex';

    try {
        const response = await fetch(`/api/device/${deviceId}/history`);
        const json = await response.json();

        if (json.success && json.data.length > 0) {
            // Формуємо масиви для графіка ТУТ, щоб не було помилки "labels is not defined"
            const labelsData = json.data.map(log => 
                new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            );
            const valuesData = json.data.map(log => log[category]);

            // Викликаємо функцію малювання і передаємо їй готові дані
            renderTheChart(labelsData, valuesData, label);
        } else {
            console.warn("Історія порожня або пристрій не знайдено");
        }
    } catch (err) {
        console.error("Помилка завантаження даних:", err);
    }
}

// Функція малювання графіка
function renderTheChart(labels, values, label) {
    const canvas = document.getElementById('sensorChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Видаляємо старий графік, якщо він є
    if (myChart) {
        myChart.destroy();
    }

    // Колір лінії (неоновий зелений під твій інтерфейс)
    const neonGreen = '#6fdc8c';

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Тепер вони визначені!
            datasets: [{
                label: label,
                data: values, // Тепер вони визначені!
                borderColor: neonGreen,
                backgroundColor: 'rgba(111, 220, 140, 0.1)',
                borderWidth: 3,
                tension: 0.4, // Плавна лінія
                fill: true,
                pointBackgroundColor: neonGreen,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#ffffff', font: { size: 12 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#ffffff', font: { size: 10 } }
                }
            },
            plugins: {
                legend: { display: false } // Ховаємо легенду для чистоти
            }
        }
    });
}

// Функція закриття модалки
function closeChart() {
    const modal = document.getElementById('chart-modal');
    if (modal) modal.style.display = 'none';
}