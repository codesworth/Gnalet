import React from "react";

export default function PeriodOptions() {
  return (
    <div className="col-md-6">
      <div
        className="input-group marg-left"
        style={{ float: "right", width: "50%" }}
      >
        <select
          className="custom-select"
          id="inputGroupSelect04"
          aria-label="Example select with button addon"
          onChange={this.periodChange}
        >
          <option value="0">Today</option>
          <option value="1">Yesterday</option>
          <option value="2">Week</option>
          <option value="3">Month</option>
          <option value="4">2019</option>
          <option value="5">All Time</option>
        </select>
        <div className="input-group-append">
          <button
            className="btn btn-outline-info"
            type="button"
            onClick={this.updatePeriodAnalysis.bind(this)}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
