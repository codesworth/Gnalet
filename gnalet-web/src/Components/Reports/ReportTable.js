import React, { Component } from "react";
import { connect } from "react-redux";

import {
  formatDate,
  getStatusFromCode,
  FIELD_SUPBODY,
  FIELD_CATEGORY,
  _DATE
} from "../../Helpers/Constants";

import { detailsFor } from "../../actions/Reports/ReportActions";

class ReportTable extends Component {
  showDetail = report => {
    this.props.detailsFor(report);
    this.props.history.push("/report/detail");
  };

  render() {
    const reports = this.props.reports;
    return (
      <div className="col-xs-12 rounded ">
        <table className=" table  table-striped table-bordered table-hover ">
          <thead>
            <tr>
              <th>Report</th>
              <th>Reporter</th>
              <th>Region</th>
              <th>Date And Time</th>
              <th>Status</th>
              <th>Category</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>
                  {reports.indexOf(report) + 1} {""}
                </td>
                <td>{report.Reporter}</td>
                <td>{report[FIELD_SUPBODY]}</td>
                <td>{formatDate(report[_DATE])}</td>
                <td>{getStatusFromCode(report.status)}</td>
                <td>
                  <span className="badge badge-pill badge-primary">
                    {report[FIELD_CATEGORY]}
                  </span>
                </td>
                <td>
                  <button
                    onClick={this.showDetail.bind(this, report)}
                    className="btn btn-secondary btn-sm"
                  >
                    <i className="fas fa-arrow-circle-right" />
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect({ detailsFor })(ReportTable);
