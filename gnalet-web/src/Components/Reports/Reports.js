import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import {
  CLIENT_KEY,
  formatDate,
  getStatusFromCode,
  FIELD_SUPBODY,
  _DATE,
  FIELD_CATEGORY
} from "../../Helpers/Constants";
import { fetchReport, detailsFor } from "../../actions/Reports/ReportActions";
import { ReportParser } from "../../actions/Reports/ReportParser";
import SortOptions from "./Selects/SortOptions";
import Paginate from "./Selects/Paginate";
class Reports extends Component {
  state = {
    reports: [],
    notFound: false,
    isFetching: true,
    region: "ALL",
    category: "ALL",
    period: 0,
    previous: [],
    nextHolder: [],
    lastsnapshot: null
  };

  componentDidMount() {
    const period = parseInt(this.props.match.params.period, 10);
    console.log(`Ten perios is ${period}`);

    const { fetchReport, auth } = this.props;
    if (auth.user) {
      let options = {};
      const { category, region, lastsnapshot } = this.state;
      if (category === "ALL" && region === "ALL") {
        options = { period };
      } else {
        options = { category, region, period };
      }
      fetchReport(auth.user[CLIENT_KEY], options, lastsnapshot);
    }
  }

  showDetail = report => {
    this.props.detailsFor(report);
    this.props.history.push("/report/detail");
  };

  componentWillReceiveProps(nextProps) {
    const { reports } = nextProps.reports;
    console.log(`reports are: ${reports}`);
    if (reports && reports.docs) {
      console.log(reports);
      const parser = new ReportParser(reports.docs);
      const data = parser.documents;
      console.log(`Data are: ${data}`);
      this.setState({
        reports: data,
        lastsnapshot: reports.last,
        isFetching: false
      });
    } else {
      this.setState({ isFetching: false });
    }
  }

  updateSorts = (args, val) => {
    this.setState({
      [args]: val,
      lastsnapshot: null,
      previous: [],
      nextHolder: []
    });
  };

  updateQueries = () => {
    this.refetchReports();
  };

  refetchReports = () => {
    const { auth, fetchReport } = this.props;
    let options = {};
    const { category, region, period, lastsnapshot } = this.state;
    if (category === "ALL" && region == "ALL") {
      options = { period };
    } else {
      options = { category, region, period };
    }
    console.log(options);
    fetchReport(auth.user[CLIENT_KEY], options, lastsnapshot);
  };

  loadNext = () => {
    console.log("Will load Next");
    const { reports, previous, nextHolder } = this.state;
    previous.push(reports);
    if (nextHolder.length !== 0) {
      const data = nextHolder.pop();
      this.setState({ previous, reports: data });
      return;
    }
    this.setState({ previous });
    this.refetchReports();
  };

  loadPrevious = () => {
    const { previous, reports, nextHolder } = this.state;
    if (previous.length == 0) return;
    const data = previous.pop();
    if (reports) nextHolder.push(reports);
    this.setState({ reports: data, previous, nextHolder });
  };

  render() {
    const { auth } = this.props;

    if (auth && !this.state.isFetching) {
      const { reports } = this.state;
      if (reports.length == -1) {
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
            <div className="col-md-6 pt-4">
              <h3>
                {" "}
                <i className="fas fa-copy" /> REPORTS{" "}
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <SortOptions
                updateSorts={this.updateSorts}
                periodval={this.props.match.params.period}
                updateQueries={this.updateQueries}
              ></SortOptions>
            </div>
          </div>
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
          <div className="row justify-content-center">
            <Paginate
              loadPrevious={this.loadPrevious.bind(this)}
              loadNext={this.loadNext.bind(this)}
            ></Paginate>
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
  { fetchReport, detailsFor }
)(Reports);
