# 🌱 Irrigation Cycle Planner

A React-based web application for smart irrigation scheduling using configurable plots, motors, runtime, and intervals.

---

## 🚀 Features

- 🛠️ Dynamic schedule generation with round-robin motor allocation
- ⏱️ Real-time progress tracking with status indicators
- 📊 Summary dashboard showing running, done, and upcoming plots
- 🔍 Filtering and sorting options for better usability
- 📱 Fully responsive and mobile-friendly interface

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── InputForm.jsx           # User input form for scheduling parameters
│   ├── ScheduleTable.jsx       # Displays schedule table with status and progress
│   ├── StatusBadge.jsx         # Reusable status indicator component
│   └── SummaryDashboard.jsx    # Overview dashboard with stats and progress bar
│
├── utils/
│   └── scheduler.js            # Core scheduling logic with optimized performance
│
├── styles/
│   └── app.css                 # Global and component-level styling
│
├── App.jsx                     # Root component tying everything together
└── index.js                    # Entry point for React application
```

---

## 🧠 Smart Scheduling Algorithm

The core logic (`scheduler.js`) uses a **round-robin** batching approach for assigning motors to plots in time-efficient cycles.

- ✅ Optimized time complexity: **O(n)** where _n_ = total cycles
- ❌ Avoids nested loops over plots × motors
- 📈 Easy to extend for more advanced planning features

---

## 🛠️ Tech Stack

- React + Hooks
- Functional Components
- CSS Flexbox/Grid
- Netlify Hosting

---

## 🌐 Live Demo

🚀 **[View Deployed App](https://irrigation-cycle-planner-project.netlify.app])**  
_(Replace with your real Netlify link)_

---

## 📝 Getting Started

```bash
npm install
npm start
```

To generate the production build:

```bash
npm run build
```

---

## 🧪 Example Inputs

| Parameter  | Value    |
| ---------- | -------- |
| Plots      | 4        |
| Motors     | 2        |
| Start Time | 060000   |
| End Time   | 190000   |
| Runtime    | 5 (min)  |
| Interval   | 20 (min) |

---

## 📃 License

MIT © 2025 Happy Gaming World
