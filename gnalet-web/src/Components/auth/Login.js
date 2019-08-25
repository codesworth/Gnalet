import React, { Component } from "react";

import { connect } from "react-redux";

import PropTypes from "prop-types";

import Alert from "../layout/Alert";
import gnaletlogo from "./gnalet2.png";
import Spinner from "../layout/Spinner";
import { login } from "../../actions/authActions";

class Login extends Component {
  state = {
    email: "",
    password: "",
    isLoading: false,
    errors: {}
  };

  onSubmit = e => {
    this.setState({ isLoading: true });
    e.preventDefault();
    const { email, password } = this.state;
    const { login } = this.props;

    login({ email, password });
    /*login({email, password}).catch(err => {
            notifyUser("Encountered Error",'error')
            this.setState({isLoading:false});
        });*/
  };

  componentWillReceiveProps(nextProps) {
    const { auth } = nextProps;

    if (auth.isAuthenticated) {
      this.props.history.push("/");
    } else {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });
  render() {
    const { message, messageType } = this.props.notify;

    return (
      <div className="row">
        <div className="col-md-6 mx-auto">
          {this.state.isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
              }}
            >
              <Spinner />
            </div>
          ) : null}
          <div className="card">
            <div className="card-body">
              {message ? (
                <Alert message={message} messageType={messageType} />
              ) : null}
              <h1 className="text-center pb-4 pt-3">
                <span className="text-primary">
                  <img src={gnaletlogo} alt=""></img>
                </span>
              </h1>

              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    required
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    required
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>

                <input
                  type="submit"
                  value="Login"
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

Login.propTypes = {
  firebase: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  notifyUser: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { login }
)(Login);

/*export default compose(
    firebaseConnect(),
    connect((state, props) => ({
        notify: state.notify
    }),{ notifyUser })
)(Login)*/
