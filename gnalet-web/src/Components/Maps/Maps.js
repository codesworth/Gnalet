import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import PropTypes from "prop-types";
import { IssuesMap } from "./IssueMapCluster";
import {
  getlast20Issues,
  markerIcoForCategory
} from "../../actions/firestoreActions";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { FIELD_CATEGORY, REF_REPORTS, _DATE } from "../../Helpers/Constants";
class Maps extends Component {
  constructor() {
    super();
    this.state = {
      markers: null,
      showingInfoWindow: false,
      activeMarker: null
    };
  }

  componentDidMount() {
    const { firestore } = this.props;
    firestore
      .collection(REF_REPORTS)
      .orderBy(_DATE, "desc")
      .limit(20)
      .get()
      .then(bigquery => {
        const markers = [];
        bigquery.docs.forEach(doc => {
          const cat = doc.get(FIELD_CATEGORY);
          const ico = markerIcoForCategory(cat);
          const marker = { ico, report: doc.data() };
          markers.push(marker);
        });
        console.log("These are the issues: " + markers);
        this.setState({ markers });
      });

    //this.props.getlast20Issues("hello");
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

Maps.propTypes = {
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
)(Maps);

/** 
const mapStateToProps = state => ({
  markers: state.fstore.markers
});

export default connect(
  mapStateToProps,
  { getlast20Issues }
)(Maps);
*/
