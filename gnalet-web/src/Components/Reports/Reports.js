import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import {
  CLIENT_KEY,
  formatDate,
  getStatusFromCode,
  FIELD_SUPBODY
} from "../../Helpers/Constants";
import { fetchReport } from "../../actions/Reports/ReportActions";
import { ReportParser } from "../../actions/Reports/ReportParser";
import SortOptions from "./Selects/SortOptions";
class Reports extends Component {
  state = {
    reports: [],
    notFound: false,
    isFetching: true,
    region: "All",
    category: "All",
    period: 0
  };

  componentDidMount() {
    const period = parseInt(this.props.match.params.period, 10);
    console.log(`Ten perios is ${period}`);

    const { fetchReport, auth } = this.props;
    if (auth.user) {
      let options = {};
      const { category, region, period } = this.state;
      if (category === "All" && region == "All") {
        options = { period };
      } else {
        options = { category, region, period };
      }
      fetchReport(auth.user[CLIENT_KEY], options);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { reports } = nextProps.reports;
    console.log(`reports are: ${reports}`);
    if (reports) {
      const parser = new ReportParser(reports);
      const data = parser.documents;
      console.log(`Data are: ${data}`);
      this.setState({ reports: data, isFetching: false });
    }
  }

  updateSorts = (args, val) => {
    this.setState({ [args]: val });
  };

  refetchReports = () => {
    const { auth, fetchReport } = this.props;
    let options = {};
    const { category, region, period } = this.state;
    if (category === "All" && region == "All") {
      options = { period };
    } else {
      options = { category, region, period };
    }
    fetchReport(auth.user[CLIENT_KEY], options);
  };

  render() {
    const { auth } = this.props;

    if (auth && !this.state.isFetching) {
      const { reports } = this.state;
      if (reports.length == 0) {
        return (
          <div className="row mg">
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <h3>REPORTS</h3>
                </div>
                <div className="card-body">
                  <h1> NO REPORTS AVAILABLE</h1>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="container-main">
          <div className="row">
            <div className="col-md-2">
              <h2>
                {" "}
                <i className="fas fa-copy" /> REPORTS{" "}
              </h2>
            </div>

            <div className="col-md-8">
              <SortOptions
                updateSorts={this.updateSorts}
                periodval={this.props.match.params.period}
              ></SortOptions>
            </div>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-info"
              type="button"
              onClick={this.refetchReports.bind(this)}
            >
              Update
            </button>
          </div>
          <div className="col-xs-12">
            <table className=" table  table-striped">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Reporter</th>
                  <th>Region</th>
                  <th>Date And Time</th>
                  <th>Status</th>
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
                    <td>{formatDate(report.ts)}</td>
                    <td>{getStatusFromCode(report.status)}</td>
                    <td>
                      <Link
                        to={`/report/`}
                        className="btn btn-secondary btn-sm"
                      >
                        <i className="fas fa-arrow-circle-right" />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }

  getStatusFromSort(sort) {
    switch (sort) {
      case "unsolved":
        return 0;
      case "pending":
        return 1;
      case "solved":
        return 2;
      default:
        return 100;
    }
  }
}

Reports.propTypes = {
  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array
};

const mapStateToProps = state => ({
  auth: state.auth,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { fetchReport }
)(Reports);
