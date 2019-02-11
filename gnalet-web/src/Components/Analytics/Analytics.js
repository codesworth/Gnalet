import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import {
  REF_ANALYTICS,
  AN_CATEGORICAL,
  AN_TOTALS
} from "../../Helpers/Constants";
import Spinner from "../layout/Spinner";

import {
  makeBigdataAnalytics,
  makeBigdataAnalyticsForCategories
} from "./AnalyticCalculator";
import AnalyticsTable from "./AnalyticsTable";

class Analytics extends Component {
  state = {
    bigdata: null
  };

  componentWillMount() {
    const { firestore } = this.props;
    const nbigdata = [];
    firestore
      .collection(REF_ANALYTICS)
      .get()
      .then(bigdata => {
        bigdata.forEach(element => {
          const data = element.data();
          data.key = element.id;
          nbigdata.push(data);
        });
        const analysed = makeBigdataAnalytics(nbigdata);
        const catdata = makeBigdataAnalyticsForCategories(nbigdata);
        console.log("This is big data: ", nbigdata);
        this.setState({ areadata: analysed, cat: catdata });
      });
  }

  render() {
    const { areadata, cat } = this.state;

    if (areadata && cat) {
      const { yearly, totals } = areadata;
      const catOnly = cat[AN_CATEGORICAL];
      const total = cat[AN_TOTALS];
      console.log("This is Aredata: ", yearly);
      console.log("This is catdata", catOnly);
      return (
        <div className="col-md-10">
          <AnalyticsTable
            bigdata={yearly}
            totals={totals}
            header="REPORT ANALYTICS FOR ADMINISTRATIVE AREAS"
            t1="Areas"
          />
          <AnalyticsTable
            bigdata={catOnly}
            totals={total}
            header="REPORT ANALYTICS FOR ISSUE CATEGORIES"
            t1="Category"
          />
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default compose(
  firestoreConnect(),
  withFirestore,
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
)(Analytics);
