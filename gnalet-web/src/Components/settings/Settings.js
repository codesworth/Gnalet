import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { ACCESS_CODE_MASTER,facingCategoryname,
   publicFacingRegion, REF_AUTHORITIES, ACCESS_CODE_READ, ACCESS_CODE_EDIT } from '../../Helpers/Constants';
import { compose } from 'redux';
import { firestore } from 'firebase';
import { firestoreConnect,withFirestore } from 'react-redux-firebase';
// import {setAllowRegistration, setDisableBalanceOnAdd, setDisableBalanceOnEdit} from '../../actions/settingsAction';


export class Settings extends Component {


  state = {
    authorities: []
  }

  configRegion(regions){
    if (regions.length > 0){
      if(regions.length === 1){
        return publicFacingRegion(regions[0]);
      }else{
        return "Multiple Regions"
      }
    }else{
      return ""
    }
  }

  static getDerivedStateFromProps(props, state){
    const {authorities} = props;

    console.log(props);
    

    return null;
}

  componentDidMount(){

    const {firestore} = this.props;
    const all = [];
    firestore.collection(REF_AUTHORITIES).get().then(docs => {
      docs.forEach(doc => {
          all.push(doc.data());
      })
      
      this.setState({authorities:all});
    })
  }

  configAccType(access){
    switch (access){
      case ACCESS_CODE_EDIT:
        return "Adminitrative Account";
      case ACCESS_CODE_READ:
        return "Radio Account";
      case ACCESS_CODE_MASTER:
        return "Master"
      default:
        return "Bad Access"
    }
  }

  configCategory(categories){
    if (categories.length > 0){
          if(categories.length === 1){
            return facingCategoryname(categories[0]);
          }else{
            return "Multiple Categories"
          }
    }else{
      return ""
    }
  }


  render() {


    const {settings} = this.props;
    const {access,username,categories, region} = settings;
    if(access === ACCESS_CODE_MASTER){
      const {authorities} = this.state;
      console.log("The authoritues", authorities);
      return (
        <div className="container-main">
        <div className="row">
          <div className="col-md-3">
          <div className="card settings-list">
            <div className="card-header">Featured
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item settings-list-item" >Manage Authorities</li>
              <li className="list-group-item settings-list-item">Analytics</li>
              <li className="list-group-item settings-list-item">Signout</li>
            </ul>
          </div>
          </div>
          <div className="col-md-7">
            <h3>Registered User Authorities</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Account Name</th>
                  <th scope="col">Account Type</th>
                  <th scope="col">Category</th>
                  <th scope="col">Regional Jurisdiction</th>
                </tr>
              </thead>
              <tbody>
                {authorities.map(authority => {
                  return(
                    <tr key={authority.id}>
                    <th scope="row"><i className="fas fa-user"/></th>
                    <td>{authority.username}</td>
                    <td>{this.configAccType(authority.access)}</td>
                    <td>{this.configCategory(authority.categories)}</td>
                    <td>{this.configRegion(authority.region)}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div> 
      )
    }else{
      return (
        <div className="container-main">
          <div className="row">
            <div className="col-md-6">
                <h3>
                  <i className="fas fa-cogs"></i>
                    {'  '}Settings 
                </h3>
             </div>
          </div>
          <div className="row">
            <div className="col-md-10">
            <div className="card">
              <div className="card-header">
                <h4>ACCOUNT DETAILS</h4> 
              </div>
              <div className="card-body">
                <h6 className="card-title">Account Name: {username}</h6>
                <hr/>
                <h6 className="card-subtitle">
                  REPORT CATEGORIES
                </h6>
                <ul className="list-group">
                  {categories.map(cat => {
                    return (
                      <li key={cat} className="list-group-item">{facingCategoryname(cat)}</li>
                    )
                  })}
                </ul>
                <hr/>
                <h6 className="card-subtitle">
                  REGIONAL JURISDICTIONS
                </h6>
                <ul className="list-group">
                  {region.map(reg => {
                    return (
                      <li key={reg} className="list-group-item">{publicFacingRegion(reg)}</li>
                    )
                  })}
                </ul>
              </div>
            </div>
            </div>
          </div>
      </div> 
      )
    }
  }
}

Settings.propTypes = {
  settings: PropTypes.object.isRequired,

}


export default compose(
  firestoreConnect(), withFirestore,connect((state, props) => ({
      auth: state.firebase.auth,
      settings: state.settings
  }))
)(Settings)