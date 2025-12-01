// LOGIN CHECK
const username = localStorage.getItem("username");
if (!username) window.location.href = "index.html";
document.getElementById("welcome").textContent = `Welcome back, ${username} 👋`;


// === TABS === //
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});


// === SCORING + SPEEDOMETER === //
let carbonScore = parseInt(localStorage.getItem("carbonScore")) || 0;
const scoreEl = document.getElementById("carbon-score");
const levelEl = document.getElementById("level");
const needle = document.getElementById("needle");
const checkboxes = document.querySelectorAll("#actions-list input");

checkboxes.forEach(box => {
    box.addEventListener("change", () => {
        let value = parseInt(box.dataset.score);
        carbonScore += box.checked ? value : -value;
        localStorage.setItem("carbonScore", carbonScore);
        updateScoreUI();
        updateGauge();
        updateBadges();
    });
});

function updateScoreUI() {
    scoreEl.textContent = carbonScore;
}

function updateGauge() {
    let angle = -90 + Math.min(carbonScore / 600, 1) * 180;
    needle.style.transform = `rotate(${angle}deg)`;

    if (carbonScore <= 200) levelEl.textContent = "Green Zone 🟢";
    else if (carbonScore <= 450) levelEl.textContent = "Moderate Zone 🟡";
    else levelEl.textContent = "Danger Zone 🔴";
}

updateScoreUI();
updateGauge();


// === STATS SYSTEM === //
let history = JSON.parse(localStorage.getItem("history")) || [];
let streak = parseInt(localStorage.getItem("streak")) || 0;

const streakEl = document.getElementById("streak");
const saveBtn = document.getElementById("save-score-btn");

let chartInstance;
let streakChartInstance;

const chartCtx = document.getElementById("progressChart");
const streakCtx = document.getElementById("streakChart");

saveBtn.addEventListener("click", () => {
    const today = new Date().toLocaleDateString();
    if (history.some(h => h.date === today)) return alert("Saved already!");

    history.push({ date: today, score: carbonScore });
    localStorage.setItem("history", JSON.stringify(history));

    updateStreak(today);
    updateChart();
    updateStreakChart();
    updateBadges();
});

function updateStreak(today) {
    let y = new Date();
    y.setDate(y.getDate() - 1);

    if (history.some(h => h.date === y.toLocaleDateString())) streak++;
    else streak = 1;

    localStorage.setItem("streak", streak);
    streakEl.textContent = `Streak: ${streak} 🔥`;
}


// === Bubble Chart (Daily Score History) === //
function updateChart() {
    const points = history.map((h, i) => ({
        x: i + 1,
        y: h.score,
        r: Math.abs(h.score / 50) + 5,
        date: h.date
    }));

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(chartCtx, {
        type: "bubble",
        data: {
            datasets: [{
                label: "Daily Carbon Score",
                data: points,
                backgroundColor: points.map(p =>
                    p.y <= 200 ? "rgba(0,255,136,.6)" : "rgba(255,0,80,.6)"
                )
            }]
        },
        options: {
            scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.raw.date}: ${ctx.raw.y} g CO₂`
                    }
                }
            }
        }
    });
}


function updateStreakChart() {
    const container = document.getElementById("streakChart");
    if (!container) return;

    if (history.length === 0) {
        if (streakChartInstance) streakChartInstance.destroy();
        container.style.display = "none";
        return;
    }

    container.style.display = "block";

    const labels = history.map((_, i) => `Day ${i + 1}`);
    const streakValues = history.map((_, i) => i + 1);

    if (streakChartInstance) streakChartInstance.destroy();

    streakChartInstance = new Chart(container, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: streakValues,
                label: "Streak",
                borderColor: "#00FF88",
                backgroundColor: "rgba(0,255,136,0.3)",
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: "#00FF88",
                tension: 0.3,
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    title: { display: true, text: "Day", color: "#fff" },
                    ticks: { color: "#fff" },
                    grid: { display: false }
                },
                y: {
                    title: { display: true, text: "Streak Count", color: "#fff" },
                    beginAtZero: true,
                    ticks: { color: "#fff", precision: 0 },
                    grid: { color: "#333" }
                }
            }
        }
    });
}


// === REWARDS SYSTEM === //
function updateBadges() {
    const box = document.getElementById("badges");
    box.innerHTML = "";
    let unlocked = 0;

    if (history.some(h => h.score <= 250)) { box.innerHTML += `<div class="badge">💧 Water Saver</div>`; unlocked++; }
    if (carbonScore <= 150) { box.innerHTML += `<div class="badge">🌱 Low-Carbon Hero</div>`; unlocked++; }
    if (history.length >= 3) { box.innerHTML += `<div class="badge">📆 Consistent Tracker</div>`; unlocked++; }
    if (streak >= 3) { box.innerHTML += `<div class="badge">🌍 Carbon Champion</div>`; unlocked++; }

    if (!unlocked) box.innerHTML = `<p>No badges unlocked yet 👀</p>`;
}


// === INITIAL LOAD === //
updateStreak(new Date().toLocaleDateString());
updateChart();
updateStreakChart();
updateBadges();
