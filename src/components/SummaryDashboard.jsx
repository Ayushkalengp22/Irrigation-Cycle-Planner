import React from "react";

const SummaryDashboard = ({ data }) => {
  if (data.length === 0) return null;

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

  // Calculate statistics
  const scheduleWithStatus = data.map((item) => ({
    ...item,
    status: getStatus(item.startTime, item.endTime),
  }));

  const doneCount = scheduleWithStatus.filter(
    (item) => item.status === "Done"
  ).length;
  const pendingCount = scheduleWithStatus.filter(
    (item) => item.status === "Pending"
  ).length;
  const inProgressCount = scheduleWithStatus.filter(
    (item) => item.status === "In Progress"
  ).length;

  // Find currently running plots (multiple)
  const currentlyRunning = scheduleWithStatus.filter(
    (item) => item.status === "In Progress"
  );
  console.log(currentlyRunning, "currentlyRunning");
  const motorCount =
    data.length > 0
      ? Math.max(...data.map((item) => parseInt(item.runBy.replace("M", ""))))
      : 0;
  // Find next pending plots (multiple)
  const nextPending = scheduleWithStatus
    .filter((item) => item.status === "Pending")
    .slice(0, motorCount);

  // Calculate completion percentage
  const completionPercentage =
    data.length > 0 ? Math.round((doneCount / data.length) * 100) : 0;
  return (
    <div className="summary-dashboard">
      <h2 className="summary-title">Schedule Overview</h2>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percentage">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        {/* Total Cycles */}
        <div className="stat-card total">
          <div className="stat-icon">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{data.length}</div>
            <div className="stat-label">Total Cycles</div>
          </div>
        </div>

        {/* Done */}
        <div className="stat-card done">
          <div className="stat-icon">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{doneCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* In Progress */}
        <div className="stat-card progress">
          <div className="stat-icon">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{inProgressCount}</div>
            <div className="stat-label">Running</div>
          </div>
        </div>

        {/* Pending */}
        <div className="stat-card pending">
          <div className="stat-icon">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="current-status">
        <div className="status-row">
          <div className="status-item">
            <div className="status-header">
              <div className="status-dot running"></div>
              <span className="status-title">Currently Running</span>
            </div>
            <div className="status-value">
              {currentlyRunning.length > 0 ? (
                <div className="running-plots">
                  {currentlyRunning.map((plot, index) => (
                    <div key={plot.index} className="running-info">
                      <span className="plot-name">{plot.plot}</span>
                      <span className="plot-details">
                        {plot.runBy} • {formatTime(plot.startTime)} -{" "}
                        {formatTime(plot.endTime)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="no-activity">No active irrigation</span>
              )}
            </div>
          </div>

          <div className="status-item">
            <div className="status-header">
              <div className="status-dot next"></div>
              <span className="status-title">Up Next</span>
            </div>
            <div className="status-value">
              {nextPending.length > 0 ? (
                <div className="next-plots">
                  {nextPending.map((plot, index) => (
                    <div key={plot.index} className="next-info">
                      <span className="plot-name">{plot.plot}</span>
                      <span className="plot-details">
                        {plot.runBy} • Starts at {formatTime(plot.startTime)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="no-activity">All cycles completed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
