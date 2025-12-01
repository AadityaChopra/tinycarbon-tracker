# TinyCarbon Tracker 🌱

A simple, interactive web application that helps users track daily micro‑actions that impact the environment.  
Built using **HTML, CSS & JavaScript** — fully functional with local storage support.

🚀 Live Demo: *(Enable GitHub Pages from repo settings to get link here)*  
📦 Repository: https://github.com/AadityaChopra/tinycarbon-tracker

---

## 🌍 Features

| Feature | Description |
|--------|-------------|
| ✔ Login System | Saves username locally |
| ✔ Carbon Score Tracker | Adds / reduces carbon points based on habits |
| ✔ Real‑time Speedometer | Shows current carbon impact in Red / Yellow / Green zones |
| ✔ Daily Streak Counter | Motivates user consistency |
| ✔ Save Score System | Stores score for each day |
| ✔ Streak Line Graph | Visual trend of habit improvement over time |
| ✔ Rewards & Badges | Unlock achievements for low carbon habits |
| ✔ Dark Mode UI | Sleek & modern dashboard look |
| ✔ Fully Client‑Side | No backend required |

---

## 📊 Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**  
- **Chart.js** → Data visualization library  
- **LocalStorage** → Saves user progress locally

---

## 🧠 How It Works (Logic Summary)

Carbon score updates using:
```js
data-score (positive = bad actions)
data-score (negative = good actions)
