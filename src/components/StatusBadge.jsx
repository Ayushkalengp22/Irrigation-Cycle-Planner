import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Done":
        return "status-done";
      case "In Progress":
        return "status-progress";
      case "Pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getDotClass = (status) => {
    switch (status) {
      case "Done":
        return "dot-done";
      case "In Progress":
        return "dot-progress";
      case "Pending":
        return "dot-pending";
      default:
        return "dot-default";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      <span className={`status-dot ${getDotClass(status)}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
