import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import AppNavBar from "./Components/layout/AppNavBar";

import Login from "./Components/auth/Login";
// import Register from "./Components/auth/Register";
// import Settings from "./Components/settings/Settings";
import Home from "./Components/Reports/Home";
import Reports from "./Components/Reports/Reports";
import ReportDetail from "./Components/Reports/ReportDetail";
// import ReportLocation from "./Components/Clients/ReportLocation";
// import AuthBodyDetail from "./Components/Clients/AuthBodyDetail";
import Maps from "./Components/Maps/Maps";
//import { initialize } from "./backend/firebase";
import PrivateRoute from "./Components/Security/PrivateRoute";
import DummyHome from "./Components/Reports/DummyHome";

//initialize();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="Appp">
            <AppNavBar />
            <div className="container">
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute
                  exact
                  path="/reports/:status/:period"
                  component={Reports}
                />
                <PrivateRoute
                  exact
                  path="/report/detail"
                  component={ReportDetail}
                ></PrivateRoute>
                <PrivateRoute
                  exact
                  path="/maps"
                  component={Maps}
                ></PrivateRoute>
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
 * 
 * <PrivateRoute exact path="/maps" component={Maps} />
                <PrivateRoute
                  exact
                  path="/reports/:regcat/:sort"
                  component={Reports}
                />
                <PrivateRoute exact path="/client/add" component={AddClient} />
                <PrivateRoute
                  exact
                  path="/report/:category/:id"
                  component={ReportDetail}
                />
                <PrivateRoute
                  exact
                  path="/report/:category/location/:coordinate"
                  component={ReportLocation}
                />
                <PrivateRoute exact path="/settings" component={Settings} />
                <PrivateRoute
                  exact
                  path="/settings/master/:id"
                  component={AuthBodyDetail}
                />
                <PrivateRoute
                  exact
                  path="/client/edit/:id"
                  component={UserIsAuthenticated(EditClient)}
                />
 */

/**
  * 
  * <!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="/__/firebase/7.0.0/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<!-- Initialize Firebase -->
<script src="/__/firebase/init.js"></script>
  */
