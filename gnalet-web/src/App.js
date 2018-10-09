import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { UserIsAuthenticated, UserIsNotAuthenticated} from './Helpers/Auth'
import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import AppNavBar from './Components/layout/AppNavBar';
import Dashboard from './Components/layout/Dashboard'
import AddClient from './Components/Clients/AddClient';
import ClientDetails from './Components/Clients/ClientDetails';
import EditClient from './Components/Clients/EditClient';
import Login from './Components/auth/Login';
import Register from './Components/auth/Register';
import Settings from './Components/settings/Settings';
import Home from './Components/Clients/Home';
import Reports from './Components/Clients/Reports';
import ReportDetail from './Components/Clients/ReportDetail';



class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <div className="Appp">
        <AppNavBar/>
        <div className='container'>
          <Switch>
            <Route exact path ='/' component={UserIsAuthenticated(Home)}></Route>
            <Route exact path ='/reports/:category/:sort' component={UserIsAuthenticated(Reports)}></Route>
            <Route exact path = '/client/add' component={UserIsAuthenticated(AddClient)}></Route>
            <Route exact path = '/report/:category/:id' component={UserIsAuthenticated(ReportDetail)}></Route>
            <Route exact path = '/client/edit/:id' component={UserIsAuthenticated(EditClient)}></Route>
            <Route exact path = '/login' component={UserIsNotAuthenticated(Login)}></Route>
            <Route exact path = '/register' component={UserIsNotAuthenticated(Register)}></Route>
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