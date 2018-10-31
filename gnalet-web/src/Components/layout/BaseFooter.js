

import React, { Component } from 'react'


var style = {
    backgroundColor: "",
    borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
    marginTop:'4%'
}

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}

export default class BaseFooter extends Component {

  render() {
    return (
        <footer style={style}>
            <div style={phantom}>
                <div className="row">
                    <div className="col-md-6">
                    <h6 className="text-brand">
                    GNALET 2018</h6>
                    </div>
                    <div className="col-md-6" style={{float:'right'}}>
                    <p>powered by <span><a className="navbar-brand" href="http://codesworth.net">Codesworth</a></span></p>
                    </div>
                </div>

            </div>
        </footer>
    )
  }
}
