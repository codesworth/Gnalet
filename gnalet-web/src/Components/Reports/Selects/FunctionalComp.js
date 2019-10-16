import React from "react";
import { getStatusFromCode } from "../../../Helpers/Constants";

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

export const StatusBadge = status => {
  let classname = "";
  console.log(status);

  switch (status.status) {
    case 0:
      classname = "badge badge-danger";
      break;
    case 1:
      classname = "badge badge-warning";
      break;
    case 2:
      classname = "badge badge-success";
      break;
    case 3:
      classname = "badge badge-dark";
      break;
    default:
      classname = "badge badge-info";
  }

  return (
    <div>
      <span className={classname}>{getStatusFromCode(status.status)}</span>
    </div>
  );
};
