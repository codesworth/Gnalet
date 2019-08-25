import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";
import PropTypes from "prop-types";
import Spinner from "../../layout/Spinner";
import * as Constants from "../../../Helpers/Constants";

class Clients extends Component {
  state = {
    clients: []
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

  componentDidMount() {
    const { firestore, auth, settings } = this.props;
    console.log("This is the auth", auth);
    console.log("This is the settings", settings);
  }

  render() {
    const { auth } = this.props;
    if (auth.uid) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <h2>
                {" "}
                <i className="fas fa-users"></i> Clients{" "}
              </h2>
            </div>

            <div className="col-md-6">
              <h5 className="text-right text-secondary">
                {" "}
                Total Owed{" "}
                <span className="text-primary">
                  ${parseFloat(78).toFixed(2)}
                </span>
              </h5>
            </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Balance</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {this.state.clients.map(client => (
                <tr key={" "}>
                  <td>
                    {""} {""}
                  </td>
                  <td>{""}</td>
                  <td>{"client.phone"}</td>
                  <td>$ {parseFloat(89).toFixed(2)}</td>
                  <td>
                    <Link to={`/client/`} className="btn btn-secondary btn-sm">
                      <i className="fas fa-arrow-circle-right"></i>Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

Clients.propTypes = {
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
)(Clients);
