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
import SortOptions from "../Reports/Selects/SortOptions";
import Paginate from "../Reports/Selects/Paginate";

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      markers: null,
      period: 0,
      showingInfoWindow: false,
      activeMarker: null,
      category: "ALL",
      region: "ALL"
    };
  }

  componentDidMount() {
    const { fetchReport, auth } = this.props;

    if (auth.user) {
      let options = {};
      const { category, region, period } = this.state;
      if (category === "ALL" && region === "ALL") {
        options = { period };
      } else {
        options = { category, region, period };
      }
      fetchReport(auth.user[CLIENT_KEY], options);
    }
  }

  awakeFromFetch = () => {
    const { fetchReport, auth } = this.props;

    if (auth.user) {
      let options = {};
      const { category, region, period } = this.state;
      if (category === "ALL" && region === "ALL") {
        options = { period };
      } else {
        options = { category, region, period };
      }
      fetchReport(auth.user[CLIENT_KEY], options);
    }
  };

  loadNext = () => {
    console.log("Will load Next");
    const { reports, previous } = this.state;
    previous.push(reports);
    this.setState({ previous });
    this.refetchReports();
  };

  loadPrevious = () => {
    const { previous } = this.state;
    const data = previous.pop();
    this.setState({ reports: data, previous });
  };

  componentWillReceiveProps(nextProps) {
    const { reports } = nextProps.reports;
    console.log(`reports are: ${reports}`);
    if (reports && reports.docs) {
      const parser = new ReportParser(reports.docs);
      const data = parser.documents;

      const markers = [];
      reports.docs.forEach(doc => {
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

  updateSorts = (args, val) => {
    this.setState({ [args]: val });
  };

  updateQueries = () => {
    this.awakeFromFetch();
  };

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
        <div className="row">
          <div className="col-md-3 col-xl-2 col-sm-3">
            <h1>Maps</h1>
          </div>
          <div className="col-md-9 col-xl-12 col-sm-9">
            <SortOptions
              updateSorts={this.updateSorts}
              updateQueries={this.updateQueries}
            ></SortOptions>
          </div>
        </div>
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
          <div className="row justify-content-center">
            <Paginate
              loadPrevious={this.loadPrevious.bind(this)}
              loadNext={this.loadNext.bind(this)}
            ></Paginate>
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
