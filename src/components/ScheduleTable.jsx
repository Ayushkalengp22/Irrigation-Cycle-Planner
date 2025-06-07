import React, { useState } from "react";
import StatusBadge from "./StatusBadge";

const ScheduleTable = ({ data, currentTime }) => {
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatus = (start, end) => {
    const current = currentTime.getHours() * 100 + currentTime.getMinutes();
    const startTime = parseInt(start.slice(0, 4));
    const endTime = parseInt(end.slice(0, 4));

    if (current < startTime) return "Pending";
    if (current > endTime) return "Done";
    return "In Progress";
  };

  const getProgress = (start, end) => {
    const current = currentTime.getHours() * 100 + currentTime.getMinutes();
    const startTime = parseInt(start.slice(0, 4));
    const endTime = parseInt(end.slice(0, 4));

    if (current < startTime) return 0;
    if (current > endTime) return 100;

    const totalDuration = endTime - startTime;
    const elapsed = current - startTime;
    return Math.min(
      100,
      Math.max(0, Math.round((elapsed / totalDuration) * 100))
    );
  };

  const formatTime = (timeStr) => {
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  if (data.length === 0) return null;

  const filteredData = data.filter((item) => {
    const status = getStatus(item.startTime, item.endTime);
    return statusFilter === "All" || status === statusFilter;
  });

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-info">
          <h2 className="table-title">Irrigation Schedule</h2>
          <p className="table-subtitle">
            Total: {filteredData.length} irrigation cycles (filtered)
          </p>
        </div>

        <div className="status-legend">
          <div className="legend-item">
            <div className="legend-dot pending-dot"></div>
            Pending
          </div>
          <div className="legend-item">
            <div className="legend-dot progress-dot"></div>
            In Progress
          </div>
          <div className="legend-item">
            <div className="legend-dot done-dot"></div>
            Done
          </div>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-bar">
        <label htmlFor="statusFilter" className="filter-label">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Plot</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Motor</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const status = getStatus(item.startTime, item.endTime);
              const progress = getProgress(item.startTime, item.endTime);

              return (
                <tr key={item.index}>
                  <td>
                    <div className="row-number">{idx + 1}</div>
                  </td>
                  <td>
                    <div className="plot-name">{item.plot}</div>
                  </td>
                  <td>
                    <div className="time-display">
                      {formatTime(item.startTime)}
                    </div>
                  </td>
                  <td>
                    <div className="time-display">
                      {formatTime(item.endTime)}
                    </div>
                  </td>
                  <td>
                    <div className="motor-badge">{item.runBy}</div>
                  </td>
                  <td>
                    <StatusBadge status={status} />
                  </td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-small">
                        <div
                          className={`progress-fill-small ${
                            status === "Done"
                              ? "complete"
                              : status === "In Progress"
                              ? "in-progress"
                              : "pending"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
