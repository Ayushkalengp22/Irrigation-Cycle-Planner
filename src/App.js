// src/App.jsx
import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import SummaryDashboard from "./components/SummaryDashboard";
import ScheduleTable from "./components/ScheduleTable";
import { generateSchedule } from "./utils/scheduler";
import "./styles/app.css";

function App() {
  const [schedule, setSchedule] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔄 Automatically update the current time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // 30,000ms = 30 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleGenerate = (inputs) => {
    const newSchedule = generateSchedule(inputs);
    setSchedule(newSchedule);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="app-header">
          <div className="header-icon">
            <svg
              className="icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="app-title">Irrigation Cycle Planner</h1>
          <p className="app-subtitle">
            Smart scheduling for efficient water management
          </p>
        </div>

        {/* Input Form */}
        <InputForm onGenerate={handleGenerate} />

        {/* Summary Dashboard */}
        <SummaryDashboard data={schedule} />

        {/* Schedule Table with current time prop */}
        <ScheduleTable data={schedule} currentTime={currentTime} />
      </div>
    </div>
  );
}

export default App;
