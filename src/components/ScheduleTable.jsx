import React from "react";
import StatusBadge from "./StatusBadge";

const ScheduleTable = ({ data }) => {
  const getStatus = (start, end) => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(start.slice(0, 4));
    const endTime = parseInt(end.slice(0, 4));

    if (currentTime < startTime) return "Pending";
    if (currentTime > endTime) return "Done";
    return "In Progress";
  };

  const formatTime = (timeStr) => {
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2, 4);
    return `${hours}:${minutes}`;
  };

  if (data.length === 0) return null;

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-info">
          <h2 className="table-title">Irrigation Schedule</h2>
          <p className="table-subtitle">
            Total: {data.length} irrigation cycles
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
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
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
                  <div className="time-display">{formatTime(item.endTime)}</div>
                </td>
                <td>
                  <div className="motor-badge">{item.runBy}</div>
                </td>
                <td>
                  <StatusBadge
                    status={getStatus(item.startTime, item.endTime)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
