import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";

import PropTypes from "prop-types";
import * as Constants from "../../Helpers/Constants";

class AppNavBar extends Component {
  state = {
    isAuthenticated: false,
    user: null
  };

  componentDidMount() {
    //console.log("componentDidMount");
  }

  // componentDidUpdate() {
  //   //console.log("componentDidUpdate");
  //   if (this.state.username === "") {
  //     //console.log("functionWillBeCalled");
  //     this.loadusername(this.props.auth.uid);
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;
    if (auth) {
      this.setState({ isAuthenticated: auth.isAuthenticated, user: auth.user });
    }
  }

  /*

  loadusername(uid) {
    const { firestore } = this.props;
    firestore.get(`${Constants.REF_AUTHORITIES}/${uid}`).then(data => {
      //console.log(data.data());
      const regions = data.data().region;
      const categories = data.data().categories;
      //console.log(regions, categories);
      const access = data.data().access;
      setCategories(categories);
      setRegions(regions);
      setUid(uid);
      setAccess(access);
      console.log("The settings inss, :", regions);
      this.setState({ username: data.data().username });
      const { requiresReload } = this.props.settings;
      if (requiresReload) {
        setReload(false);
        window.location.reload();
      }
      //
    });
  }
  */

  // static getDerivedStateFromProps(props, state) {
  //   const { auth } = props;
  //   if (auth) {
  //     return { isAuthenticated: true, user: auth.user };
  //   } else {
  //     return { isAuthenticated: false };
  //   }
  // }

  onLogoutClick = e => {
    e.preventDefault();

    //console.log("The settings ois, :",this.props);

    //window.location.reload();
  };

  render() {
    const { isAuthenticated, user } = this.state;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <h3>GNALET</h3>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMain"
          >
            <span className="navbar-toggler-icon" navbar-toggler-icon="true" />
          </button>

          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mr-auto">
              {isAuthenticated ? (
                <li>
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
              ) : null}
            </ul>
            {isAuthenticated ? (
              <ul className="navbar-nav ml-auto">
                <li>
                  <Link to="/maps" className="nav-link">
                    Maps
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="#!" className="nav-link">
                    {user ? user.username : ""}
                  </a>
                </li>
                <li>
                  <Link to="/settings" className="nav-link">
                    Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <a
                    href="/#"
                    className="nav-link"
                    onClick={this.onLogoutClick}
                  >
                    Logout
                  </a>{" "}
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    );
  }
}

AppNavBar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AppNavBar);
