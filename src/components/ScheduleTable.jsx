import React, { useState, useMemo, useCallback } from "react";
import StatusBadge from "./StatusBadge";

const ScheduleTable = ({ data, currentTime }) => {
  const loadPaginationState = () => {
    try {
      const saved = localStorage.getItem("scheduleTableState");
      if (saved) {
        const parsedState = JSON.parse(saved);
        return {
          statusFilter: parsedState.statusFilter || "All",
          currentPage: parsedState.currentPage || 1,
          itemsPerPage: parsedState.itemsPerPage || 30,
        };
      }
    } catch (error) {
      console.warn("⚠️ Failed to load pagination state:", error);
    }
    return {
      statusFilter: "All",
      currentPage: 1,
      itemsPerPage: 30,
    };
  };

  const initialState = loadPaginationState();
  const [statusFilter, setStatusFilter] = useState(initialState.statusFilter);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialState.itemsPerPage);

  React.useEffect(() => {
    const stateToSave = {
      statusFilter,
      currentPage,
      itemsPerPage,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("scheduleTableState", JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("⚠️ Failed to save pagination state:", error);
    }
  }, [statusFilter, currentPage, itemsPerPage]);

  const getStatus = useCallback(
    (start, end) => {
      const current = currentTime.getHours() * 100 + currentTime.getMinutes();
      const startTime = parseInt(start.slice(0, 4));
      const endTime = parseInt(end.slice(0, 4));

      if (current < startTime) return "Pending";
      if (current > endTime) return "Done";
      return "In Progress";
    },
    [currentTime]
  );

  const getProgress = useCallback(
    (start, end) => {
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
    },
    [currentTime]
  );

  const formatTime = useCallback((timeStr) => {
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2, 4);
    return `${hours}:${minutes}`;
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const status = getStatus(item.startTime, item.endTime);
      return statusFilter === "All" || status === statusFilter;
    });
  }, [data, statusFilter, getStatus]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  React.useEffect(() => {
    const maxPage = Math.ceil(filteredData.length / itemsPerPage) || 1;
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [filteredData.length, itemsPerPage, currentPage]);

  const prevFilterRef = React.useRef(statusFilter);
  React.useEffect(() => {
    if (
      prevFilterRef.current !== statusFilter &&
      prevFilterRef.current !== undefined
    ) {
      setCurrentPage(1);
    }
    prevFilterRef.current = statusFilter;
  }, [statusFilter]);

  const goToInProgressPage = useCallback(() => {
    if (statusFilter !== "In Progress") {
      setStatusFilter("In Progress");
      setCurrentPage(1);
    } else {
      const inProgressItems = data.filter(
        (item) => getStatus(item.startTime, item.endTime) === "In Progress"
      );
      if (inProgressItems.length > 0) {
        const firstInProgressIndex = filteredData.findIndex(
          (item) => getStatus(item.startTime, item.endTime) === "In Progress"
        );
        if (firstInProgressIndex !== -1) {
          const pageNumber =
            Math.floor(firstInProgressIndex / itemsPerPage) + 1;
          setCurrentPage(pageNumber);
        }
      }
    }
  }, [statusFilter, data, getStatus, filteredData, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    document
      .querySelector(".table-container")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const clearSavedState = useCallback(() => {
    localStorage.removeItem("scheduleTableState");
    setStatusFilter("All");
    setCurrentPage(1);
    setItemsPerPage(30);
  }, []);

  if (data.length === 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-info">
          <h2 className="table-title">Irrigation Schedule</h2>
          <p className="table-subtitle">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)}{" "}
            of {filteredData.length} cycles
            {filteredData.length !== data.length &&
              ` (filtered from ${data.length} total)`}
          </p>

          {(statusFilter !== "All" ||
            currentPage !== 1 ||
            itemsPerPage !== 30) && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#3b82f6",
                margin: "0.25rem 0",
                fontStyle: "italic",
              }}
            >
              💾 View state saved - you'll return here after page reload
            </p>
          )}
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

      <div
        className="controls-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "1rem 0",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div
          className="filter-section"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
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

        <div
          className="quick-actions"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <button
            onClick={goToInProgressPage}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#fb923c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
            title="Jump to currently running cycles"
          >
            🔄 Show Running
          </button>

          <button
            onClick={clearSavedState}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
            title="Reset pagination to defaults"
          >
            🗑️ Reset View
          </button>
        </div>

        <div
          className="items-per-page"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <label style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Items per page:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: "0.25rem 0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
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
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => {
              const status = getStatus(item.startTime, item.endTime);
              const progress = getProgress(item.startTime, item.endTime);
              const globalIndex = startIndex + idx + 1;

              return (
                <tr key={item.index}>
                  <td>
                    <div className="row-number">{globalIndex}</div>
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

      {totalPages > 1 && (
        <div
          className="pagination"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            padding: "1.5rem",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: currentPage === 1 ? "#f9fafb" : "white",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
            }}
          >
            ← Previous
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && handlePageChange(page)}
              disabled={page === "..."}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                backgroundColor:
                  page === currentPage
                    ? "#3b82f6"
                    : page === "..."
                    ? "transparent"
                    : "white",
                color:
                  page === currentPage
                    ? "white"
                    : page === "..."
                    ? "#9ca3af"
                    : "#374151",
                cursor: page === "..." ? "default" : "pointer",
                fontSize: "0.875rem",
                fontWeight: page === currentPage ? "600" : "400",
                minWidth: "2.5rem",
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              backgroundColor: currentPage === totalPages ? "#f9fafb" : "white",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
            }}
          >
            Next →
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            fontSize: "0.875rem",
            color: "#6b7280",
            borderTop: "1px solid #f3f4f6",
          }}
        >
          Page {currentPage} of {totalPages} • {filteredData.length} total
          results
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
