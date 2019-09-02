import React, { Component } from "react";
import { MapComponent } from "./Maps";

class ReportLocation extends Component {
  render() {
    const { showsMarker, lat, lng } = this.props;
    return (
      <div className="container">
        <div className="row mg">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <h3>REPORT LOCATION</h3>
              </div>
              <div className="card-body">
                <div className="view overlay hm-white-light z-depth-1-half">
                  <MapComponent
                    isMarkerShown={showsMarker}
                    lat={lat}
                    lng={lng}
                  ></MapComponent>
                  <div className="mask"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportLocation;
