import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserIsAuthenticated, UserIsNotAuthenticated } from "./Helpers/Auth";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import AppNavBar from "./Components/layout/AppNavBar";

import AddClient from "./Components/Clients/AddClient";

import EditClient from "./Components/Clients/EditClient";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Settings from "./Components/settings/Settings";
import Home from "./Components/Clients/Home";
import Reports from "./Components/Clients/Reports";
import ReportDetail from "./Components/Clients/ReportDetail";
import ReportLocation from "./Components/Clients/ReportLocation";
import AuthBodyDetail from "./Components/Clients/AuthBodyDetail";
import Maps from "./Components/Maps/Maps";
import { initialize } from "./backend/firebase";

initialize();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="Appp">
            <AppNavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={UserIsAuthenticated(Home)} />
                <Route
                  exact
                  path="/maps"
                  component={UserIsAuthenticated(Maps)}
                />
                <Route
                  exact
                  path="/reports/:regcat/:sort"
                  component={UserIsAuthenticated(Reports)}
                />
                <Route
                  exact
                  path="/client/add"
                  component={UserIsAuthenticated(AddClient)}
                />
                <Route
                  exact
                  path="/report/:category/:id"
                  component={UserIsAuthenticated(ReportDetail)}
                />
                <Route
                  exact
                  path="/report/:category/location/:coordinate"
                  component={UserIsAuthenticated(ReportLocation)}
                />
                <Route
                  exact
                  path="/settings"
                  component={UserIsAuthenticated(Settings)}
                />
                <Route
                  exact
                  path="/settings/master/:id"
                  component={UserIsAuthenticated(AuthBodyDetail)}
                />
                <Route
                  exact
                  path="/client/edit/:id"
                  component={UserIsAuthenticated(EditClient)}
                />
                <Route
                  exact
                  path="/login"
                  component={UserIsNotAuthenticated(Login)}
                />
                <Route
                  exact
                  path="/register"
                  component={UserIsNotAuthenticated(Register)}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

/**
 *
 * <Route exact path = '/settings' component={UserIsAuthenticated(Settings)}></Route>
 */
