import React, { Component } from "react";

export default class DetailMap extends Component {
  render() {
    return (
      <div className="row mg">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <h3>REPORT</h3>
            </div>
            <div className="card-body">
              <div className="view overlay hm-white-light z-depth-1-half">
                {report.link !== "" ? (
                  <img
                    src={report.link}
                    className="img-fluid"
                    onClick={() => window.open(report.link)}
                  />
                ) : (
                  <h3>NO IMAGE ATTACHED TO THIS REPORT</h3>
                )}
                <div className="mask"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
