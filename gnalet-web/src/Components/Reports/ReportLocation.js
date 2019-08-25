import React, { Component } from 'react'
import { MapComponent } from './Maps';
import { Link } from 'react-router-dom'

class ReportLocation extends Component {

    state = {
        lat: 0,
        lng: 0,
        showsMarker:true
    }

    

    componentDidMount = () => {
      const {coordinate} = this.props.match.params;
      const carray = coordinate.split('&');
      const lat = parseFloat(carray[0]);
      const lon = parseFloat(carray[1]);
      this.setState({lat:lat, lng:lon});
      
    }

    popBack = () => {
        window.history.back()
    }
    

  render() {
      const {showsMarker,lat,lng} = this.state;
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <a onClick={this.popBack.bind(this)} className="btn btn-link">
                        <i className="fas fa-arrow-circle-left"></i>
                            Back To Dashboard
                        </a>
                    </div>
                    {/* <div className="col-md-6">
                        <div className="btn-group float-right">
                            <button className="btn btn-warning">Set Pending</button>
                            <button  className="btn btn-success">Set Solved</button>
                            <button className="btn btn-danger">Flag Report</button>
                        </div>
                    </div> */}
                </div>
                <div className='row mg'>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3>REPORT LOCATION</h3>
                            </div>
                            <div className="card-body">
                                <div className="view overlay hm-white-light z-depth-1-half">
                                    <MapComponent isMarkerShown={showsMarker}
                                    lat={lat} lng={lng}
                                    ></MapComponent>
                                    <div className="mask"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
        </div>
    )
  }
}


export default ReportLocation;