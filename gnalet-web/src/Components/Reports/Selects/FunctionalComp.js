import React from "react";

export const CategoryButton = cat => {
  let className = "";
  switch (cat) {
    case "VEHICULAR":
      className = "btn btn-outline-info";
      break;
    case "CRIMES":
      className = "btn btn-outline-danger";
      break;
    case "SANITATION":
      className = "btn btn-outline-primary";
      break;
    case "POTHOLES":
      className = "btn btn-outline-warning";
      break;
    case "ECG":
      className = "btn btn-outline-warning";
      break;
    case "WATER":
      className = "btn btn-outline-primary";
      break;
    case "HFDA":
      className = "btn btn-outline-success";
      break;
    case "GSA":
      className = "btn btn-outline-secondary";
      break;
    case "INDISCIPLINE":
      className = "btn btn-outline-dark";
      break;
    default:
      className = "btn btn-outline-warning";
  }
  return (
    <div>
      <button className={className}>
        {cat.toUpperCase()} <i className="fas fa-map-marker-alt"></i>
      </button>
    </div>
  );
};
