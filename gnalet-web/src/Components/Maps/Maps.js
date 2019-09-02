import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { IssuesMap } from "./IssueMapCluster";
import { markerIcoForCategory } from "../../actions/firestoreActions";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import {
  FIELD_CATEGORY,
  REF_REPORTS,
  _DATE,
  CLIENT_KEY
} from "../../Helpers/Constants";
import { fetchReport } from "../../actions/Reports/ReportActions";
import { ReportParser } from "../../actions/Reports/ReportParser";

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      markers: null,
      period: 0,
      showingInfoWindow: false,
      activeMarker: null,
      category: "All",
      region: "All"
    };
  }

  componentDidMount() {
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

    //this.props.getlast20Issues("hello");
  }

  componentWillReceiveProps(nextProps) {
    const { reports } = nextProps.reports;
    console.log(`reports are: ${reports}`);
    if (reports) {
      const parser = new ReportParser(reports);
      const data = parser.documents;

      const markers = [];
      reports.forEach(doc => {
        const cat = doc.get(FIELD_CATEGORY);
        const ico = markerIcoForCategory(cat);
        const marker = { ico, report: doc.data() };
        markers.push(marker);
      });
      this.setState({ markers });
    } else {
      //this.setState({ isFetching: false });
    }
  }

  openDetail(marker) {
    // const category = marker.report[FIELD_CATEGORY];
    // const id = marker.report.id;
    // window.history.push(`/report/${category}/${id}`);
  }

  markerClicked(marker) {
    this.setState({ activeMarker: marker, showingInfoWindow: true });
    console.log("These are the issues: " + marker);
  }

  render() {
    const { markers, activeMarker, showingInfoWindow } = this.state;
    return (
      <div>
        <h1>Maps</h1>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="card">
              <div className="card-body">
                {markers ? (
                  <IssuesMap
                    markers={markers}
                    activeMarker={activeMarker}
                    showingInfoWindow={showingInfoWindow}
                    markerClicked={this.markerClicked.bind(this)}
                    openDetail={this.openDetail.bind(this)}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Maps.propTypes = {};

const mapStateToProps = state => ({
  auth: state.auth,
  reports: state.reports
});

export default connect(
  mapStateToProps,
  { fetchReport }
)(Maps);
