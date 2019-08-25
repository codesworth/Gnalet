import React, { Component } from "react";

import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import {
  REF_ANALYTICS,
  FIELD_UNSOLVED,
  FIELD_PENDING,
  FIELD_FLAGGED,
  FIELD_SOLVED,
  returnMonthYear,
  REF_MONTHS,
  facingCategoryname,
  publicFacingRegion
} from "../../Helpers/Constants";

class Home extends Component {
  state = {
    analytics: {
      unsolved: 0,
      pending: 0,
      flag: 0,
      solved: 0
    },
    canFetch: false,
    selectedcategory: "",
    selectedregion: "",
    period: 0,

    data: null
  };

  static getDerivedStateFromProps(props, state) {
    // const {clients} = props;

    // if(clients){

    //     //Add total
    //     const total = clients.reduce((total, client) => {
    //         return total + parseFloat(client.balance.toString());
    //     },0);
    //     return {totalowed: total};
    // }

    return null;
  }

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

  regionChange = e => {
    e.preventDefault();
    const value = e.target.value;
    this.setState({ selectedregion: value });
  };

  cateChange = e => {
    e.preventDefault();
    const value = e.target.value;
    this.setState({ selectedcategory: value });
  };

  updatePeriodAnalysis() {
    const { canFetch } = this.state;
    if (canFetch) {
      this.updateAnalysis();
    }
  }

  updateCategoriesAnalysis() {
    const { data, selectedcategory } = this.state;
    if (data === null) return;
    const catdata = data[selectedcategory];
    if (catdata) {
      let catLytics = this.makeAnalytics(catdata);
      this.setState({ analytics: catLytics });
    }
  }

  // updateRegionAnalysis() {
  //   const { selectedregion, data } = this.state;
  //   const bigdata = data[selectedregion];
  //   const fl = this.makeAnalytics(bigdata);
  //   this.setState({ analytics: fl, canFetch: false });
  // }

  updateAnalysis() {
    const { categories, region } = this.props.settings;
    let { selectedcategory, selectedregion } = this.state;
    const { firestore } = this.props;
    console.log("Selected cat is: ", selectedregion);
    if (selectedcategory === "") {
      selectedcategory = categories[0];
    }

    if (selectedregion === "") {
      selectedregion = region[0];
    }
    let ref = firestore.doc(`${REF_ANALYTICS}/${selectedregion}`);
    /*if (period === 1) {
      const id = returnMonthYear(null);
      ref = firestore.doc(
        `${REF_ANALYTICS}/${selectedregion}/${REF_MONTHS}/${id}`
      );
    } else {
      
    }*/

    ref.get().then(analytic => {
      const ndata = analytic.data();
      console.log("This is the dta: ", analytic);
      if (!ndata) return;
      const cat = selectedcategory;
      const analyticdata = ndata[cat];
      if (analyticdata === null || typeof analyticdata === "undefined") return;
      const fl = this.makeAnalytics(analyticdata);
      if (fl === null) return;
      this.setState({
        analytics: fl,
        data: analytic.data()
      });
    });
  }

  componentDidMount() {
    const { firestore, settings } = this.props;
    //console.log("This is the auth", auth);
    //console.log("This is the settings", settings);
    const { categories, region } = settings;
    if (region.length > 0) {
      const primeregion = region[0];
      firestore
        .collection(REF_ANALYTICS)
        .doc(primeregion)
        .get()
        .then(analytic => {
          if (!analytic.data()) return;
          console.log("This is the dta: ", analytic);
          const cat = categories[0];
          const analyticdata = analytic.data()[cat];
          if (analyticdata === undefined || typeof analyticdata === "undefined")
            return;
          const fl = this.makeAnalytics(analyticdata);

          this.setState({
            analytics: fl,
            selectedcategory: categories[0],
            selectedregion: region[0],
            data: analytic.data()
          });
          // console.log(this.state);
        });
    }
  }

  render() {
    const { auth } = this.props;
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

export default compose(
  firestoreConnect(),
  withFirestore,
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
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