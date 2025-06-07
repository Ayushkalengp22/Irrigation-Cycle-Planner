import React, { useState } from "react";

const InputForm = ({ onGenerate }) => {
  const [form, setForm] = useState({
    plots: 4,
    motors: 2,
    startTime: "060000",
    endTime: "190000",
    runtime: 5,
    interval: 20,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onGenerate(form);
  };

  const fieldLabels = {
    plots: "Number of Plots",
    motors: "Number of Motors",
    startTime: "Start Time (HHMMSS)",
    endTime: "End Time (HHMMSS)",
    runtime: "Runtime (minutes)",
    interval: "Interval (minutes)",
  };

  return (
    <div className="input-form-container">
      <h2 className="form-title">Schedule Configuration</h2>
      <div className="form-content">
        <div className="input-grid">
          {Object.keys(form).map((key) => (
            <div key={key} className="input-group">
              <label className="input-label">{fieldLabels[key]}</label>
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="input-field"
                placeholder={`Enter ${fieldLabels[key].toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button onClick={handleSubmit} className="generate-button">
            Generate Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
