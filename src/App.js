// src/App.jsx
import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import SummaryDashboard from "./components/SummaryDashboard";
import ScheduleTable from "./components/ScheduleTable";
import { generateSchedule } from "./utils/scheduler";
import "./styles/app.css";

function App() {
  const loadSavedSchedule = () => {
    try {
      const saved = localStorage.getItem("irrigationSchedule");
      if (saved) {
        const parsedSchedule = JSON.parse(saved);
        return parsedSchedule.data || [];
      }
    } catch (error) {
      console.warn("⚠️ Failed to load saved schedule:", error);
    }
    return [];
  };

  const [schedule, setSchedule] = useState(() => loadSavedSchedule());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (schedule.length > 0) {
      const scheduleData = {
        data: schedule,
        metadata: {
          createdAt: new Date().toISOString(),
          totalCycles: schedule.length,
          version: "1.0",
        },
      };

      try {
        localStorage.setItem(
          "irrigationSchedule",
          JSON.stringify(scheduleData)
        );
      } catch (error) {
        console.warn("⚠️ Failed to save schedule:", error);
      }
    }
  }, [schedule]);

  // 🔄 Update current time every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleGenerate = (inputs) => {
    const newSchedule = generateSchedule(inputs);
    setSchedule(newSchedule);
  };

  const clearSavedData = () => {
    localStorage.removeItem("irrigationSchedule");
    localStorage.removeItem("irrigationScheduleForm");
    localStorage.removeItem("scheduleTableState");
    setSchedule([]);
  };

  const hasSavedData = schedule.length > 0;
  //

  return (
    <div className="app-container">
      <div className="main-content">
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

        {/* ✅ Saved Data Status */}
        {hasSavedData && (
          <div
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              border: "1px solid #bae6fd",
              borderRadius: "1rem",
              padding: "1.5rem",
              margin: "1rem 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{ margin: 0, color: "#0c4a6e", fontSize: "1.125rem" }}
                >
                  💾 Schedule Restored Successfully
                </h3>
                <p
                  style={{
                    margin: "0.5rem 0 0 0",
                    color: "#075985",
                    fontSize: "0.875rem",
                  }}
                ></p>
              </div>
              <button
                onClick={clearSavedData}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                title="Clear all saved data and start fresh"
              >
                🗑️ Start Fresh
              </button>
            </div>
          </div>
        )}

        {/* Input Form */}
        <InputForm onGenerate={handleGenerate} />

        {/* ✅ Show components only if schedule exists */}
        {schedule.length > 0 ? (
          <>
            {/* Summary Dashboard */}
            <SummaryDashboard data={schedule} currentTime={currentTime} />

            {/* Schedule Table with current time prop */}
            <ScheduleTable data={schedule} currentTime={currentTime} />
          </>
        ) : (
          /* ✅ Empty state when no schedule */
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "3rem 2rem",
              textAlign: "center",
              border: "1px solid #f3f4f6",
              margin: "2rem 0",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
            <h3 style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
              No Schedule Generated
            </h3>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
              Configure your irrigation parameters above and click "Generate
              Schedule" to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
