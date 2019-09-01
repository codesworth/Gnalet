import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { CLIENT_KEY } from "../../Helpers/Constants";
import { fetchReport } from "../../actions/Reports/ReportActions";
class Reports extends Component {
  state = {
    reports: [],
    notFound: false,
    isFetching: true
  };

  componentDidMount() {
    const { fetchReport, auth } = this.props;
    if (auth.user) {
      fetchReport(auth.user[CLIENT_KEY]);
    }
  }

  render() {
    const { auth } = this.props;
    const category = this.props.match.params.regcat;

    if (auth && !this.state.isFetching) {
      const { issues } = this.state;
      if (issues.length == 0) {
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
            <div className="col-md-4">
              <h2>
                {" "}
                <i className="fas fa-users" /> REPORTS{" "}
              </h2>
            </div>

            <div className="col-md-8">
              <h5 className="text-right text-secondary">
                {" "}
                <span className="text-primary">{issues.length} REPORTS</span>
              </h5>
            </div>
          </div>
          <div className="col-xs-12">
            <table className=" table  table-striped">
              <thead>
                <tr>
                  <th>Issue</th>
                  <th>Sender</th>
                  <th>Assembly</th>
                  <th>Date And Time</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td>
                      {issues.indexOf(issue) + 1} {""}
                    </td>
                    <td>{issue.Reporter}</td>
                    <td>{issue[Constants.FIELD_SUPBODY]}</td>
                    <td>{Constants.formatDate(issue.ts)}</td>
                    <td>{Constants.getStatusFromCode(issue.status)}</td>
                    <td>
                      <Link
                        to={`/report/${category}/${issue.id}`}
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
