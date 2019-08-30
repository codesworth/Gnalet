import React, { Component } from "react";

import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { getRportAnalytics } from "../../actions/Reports/ReportActions";
import {
  REF_ANALYTICS,
  FIELD_UNSOLVED,
  FIELD_PENDING,
  FIELD_FLAGGED,
  FIELD_SOLVED,
  returnMonthYear,
  REF_MONTHS,
  facingCategoryname,
  publicFacingRegion,
  CLIENT_KEY
} from "../../Helpers/Constants";
import { AnalyticParser } from "../../actions/Reports/ReportParser";

class Home extends Component {
  state = {
    snapshot: null,
    canFetch: false,

    period: 0
  };

  onclicked = path => {
    //e.preventDefault()
    const { history } = this.props;
    const ucat = this.state.selectedcategory;
    const reg = this.state.selectedregion;
    const uctr = reg.concat("&").concat(ucat);
    history.push(`/reports/${uctr}/${path}`);
  };

  periodChange = e => {
    e.preventDefault();
    const value = e.target.value;
    const vals = {};
    if (parseInt(value, 10) !== this.state.period) {
      vals.canFetch = true;
    }
    if (value === "1") {
      vals.period = 1;
      this.setState(vals);
    } else {
      vals.period = 0;
      this.setState(vals);
    }
  };

  // regionChange = e => {
  //   e.preventDefault();
  //   const value = e.target.value;
  //   this.setState({ selectedregion: value });
  // };

  // cateChange = e => {
  //   e.preventDefault();
  //   const value = e.target.value;
  //   this.setState({ selectedcategory: value });
  // };

  updatePeriodAnalysis() {
    const { canFetch } = this.state;
    if (canFetch) {
      this.updateAnalysis();
    }
  }

  updateAnalysis() {}

  componentDidMount() {
    const { auth } = this.state;
    const { getRportAnalytics } = this.props;

    getRportAnalytics(auth[CLIENT_KEY]);
  }

  componentWillReceiveProps(nextProps) {
    const { snapshot } = nextProps;
    const { allTime } = this.state;
    if (snapshot) {
      let parser = new AnalyticParser(snapshot, allTime);
    }
  }

  render() {
    const { categories, region } = this.props.settings;
    region.sort();
    categories.sort();
    const { unsolved, pending, solved } = this.state.analytics;
    if (auth.uid) {
      return (
        <div className="container main">
          <div className="row">
            <div className="col-md-6">
              <h4>Summary Of Events</h4>
            </div>
          </div>

          <div className="row row-dashbord" style={{ marginTop: "3%" }}>
            <div className="col-sm-6" style={{ marginBottom: "3%" }}>
              <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                  <h5 className="card-title">Total Reports This Year</h5>
                  <h6 className="card-text">
                    {unsolved + solved + pending} Total Reports
                  </h6>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={this.onclicked.bind(this, "all")}
                  >
                    See All
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                  <h5 className="card-title">Total Unsolved Issues</h5>
                  <h6 className="card-text">{unsolved} Unsolved Reports.</h6>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={this.onclicked.bind(this, "unsolved")}
                  >
                    See All
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row row-dashbord-sep">
            <div className="col-sm-6" style={{ marginBottom: "3%" }}>
              <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                  <h5 className="card-title">Total Solved Issues</h5>
                  <h6 className="card-text">{solved} Solved Reports</h6>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={this.onclicked.bind(this, "solved")}
                  >
                    See All
                  </button>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card shadow p-3 mb-5 bg-white rounded">
                <div className="card-body">
                  <h5 className="card-title">Total Pending Issues</h5>
                  <h6>{pending} Pending Reports</h6>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={this.onclicked.bind(this, "pending")}
                  >
                    See All
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row mg">
            <div className="col-md-6" style={{ marginBottom: "3%" }}>
              {categories.length > 0 ? (
                <div className="input-group shadow p-3 mb-5 bg-white rounded">
                  <select
                    className="custom-select"
                    id="inputGroupSelect04"
                    aria-label=""
                    onChange={this.cateChange}
                  >
                    {categories.map(cat => {
                      return (
                        <option key={cat} value={cat}>
                          {facingCategoryname(cat)}
                        </option>
                      );
                    })}
                  </select>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.updateCategoriesAnalysis.bind(this)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-md-6">
              {region.length > 0 ? (
                <div className="input-group shadow p-3 mb-5 bg-white rounded">
                  <select
                    className="custom-select"
                    id="inputGroupSelect04"
                    aria-label=""
                    onChange={this.regionChange}
                  >
                    {region.map(reg => {
                      return (
                        <option key={reg} value={reg}>
                          {publicFacingRegion(reg)}
                        </option>
                      );
                    })}
                  </select>
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={this.updateAnalysis.bind(this)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }

  /**
   * Helper Functions Necessary For This Class only
   */

  makeAnalytics(bigdata) {
    //console.log(bigdata);
    let u = 0,
      p = 0,
      f = 0,
      s = 0;
    u = u + bigdata[FIELD_UNSOLVED];
    p = p + bigdata[FIELD_PENDING];
    f = f + bigdata[FIELD_FLAGGED];
    s = s + bigdata[FIELD_SOLVED];

    const fl = {
      unsolved: u,
      pending: p,
      flag: f,
      solved: s
    };
    return fl;
  }
}

Home.propTypes = {
  firestore: PropTypes.object.isRequired,
  clients: PropTypes.array
};

const mapStatetoProps = state => ({
  auth: state.auth,
  reports: state.auth
});

export default connect(
  mapStatetoProps,
  { getRportAnalytics }
)(Home);

/**
 * 
 * <div className="dropdown-menu">
        {this.state.cats.map(function(listValue){
            return <a className="dropdown-item" key={listValue.key} href="#!">{listValue.home}</a>;
          })}
        </div>
 */

/**
  * 
  *             <div className="col-md-6">
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
                  <option value="0">All Time</option>
                  <option value="1">This Month</option>
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
  */
