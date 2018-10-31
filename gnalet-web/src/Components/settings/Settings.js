import React, { Component } from 'react'

import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { ACCESS_CODE_MASTER,facingCategoryname,
   publicFacingRegion, REF_AUTHORITIES, ACCESS_CODE_READ, ACCESS_CODE_EDIT, category_ids, region_ids, URL_ADD_AUTH, } from '../../Helpers/Constants';
import { compose } from 'redux';
import axios from 'axios'

import { firestoreConnect,withFirestore, firebaseConnect } from 'react-redux-firebase';
import Analytics from '../Clients/Analytics';

// import {setAllowRegistration, setDisableBalanceOnAdd, setDisableBalanceOnEdit} from '../../actions/settingsAction';


export class Settings extends Component {


  state = {
    authorities: [],
    newAuthInfo:{
      username:'',
      email: '',
      password: '',
      categories: [],
      region:[],
      access:0
    },
    authority: null,
    show:false,
    index:0
  }


  changeIndex = (index) => {
    this.setState({index:index});
  }


  authority = null;

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

  detailModal(){
    if(this.state.authorities.length < 1){
      return undefined;
    }
    const {region, categories, username} = this.state.authority;
    return (
      <div show='true' class="modal fade bd-example-modal-lg" id="showDetail" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div className="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="modal-body">
                <div className="row">
                    <div className="col-md-10">
                        <div className="card">
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

                <div class="modal-footer">
                    <button data-dismiss="modal" class="btn btn-danger mr-auto">Delete Account</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button data-dismiss="modal" type="button" class="btn btn-primary">Update Details</button>
                    
                </div>
            </div>
        </div>
        </div>
    )
  }

  openDetail = (authority) => {
     this.setState({show:true, authority:authority});
     const {history} = this.props;
     history.push(`/settings/master/${authority.id}`,{authority:authority});
  }


  registerAccount = () => {
    const {username,email,password,access,region,categories} = this.state.newAuthInfo;
    if (username !== '' && email !== '' && email.includes('@') && password.length > 5 && access !== 0 && region.length > 0 && categories.length > 0){
      const data = {data:this.state.newAuthInfo}
      axios.post(URL_ADD_AUTH, data)
      .then(x => alert('Authority Succesfully Added: '+x))
      .catch(err => alert("Unable to create Account due to: "+err));
      
    }else{
      alert("Invalid Fields");
    }
  }

  onChange = (e) => {
    //console.log("The target v was: ", e.target.value);
    const {newAuthInfo} = this.state;
    
    if(e.target.name === 'access'){
      newAuthInfo[e.target.name] = parseInt(e.target.value,10);
    }else{
      newAuthInfo[e.target.name] = e.target.value;
    }
    this.setState({newAuthInfo:newAuthInfo});
  }

  onCatChange = (e) => {
    const cats = this.state.newAuthInfo.categories;
    const value = e.target.value;
    if (cats.includes(value)){
      cats.splice(cats.indexOf(value),1);
    }else{
      cats.push(value);
    }
    const {newAuthInfo} = this.state;
    newAuthInfo.categories = cats;
    this.setState({newAuthInfo:newAuthInfo});
    //console.log("The cats are", this.state);
  }

  onRegChange = (e) => {
    const regs = this.state.newAuthInfo.region;
    const value = e.target.value;
    if (regs.includes(value)){
        regs.splice(regs.indexOf(value),1);
    }else{
      regs.push(value);
    }
    const {newAuthInfo} = this.state;
    newAuthInfo.region = regs;
    
    this.setState({newAuthInfo:newAuthInfo});
    //console.log("The cats are", this.state);
  }


  addAuthModal(){
    return (
      
      <div className="modal fade" id="addAuthority" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Add User Authority Account</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
              <div className="form-group">
                  <label htmlFor="username">Authority username</label>
                  <input type="text" className="form-control" id="username" aria-describedby="emailHelp" name="username" placeholder="Enter Username" onChange={this.onChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.onChange}/>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" className="form-control" id="password" placeholder="Password" onChange={this.onChange}/>
                </div>
                <div className="form-group">
                <label htmlFor="cats">Issue Categories</label>
                {category_ids.map( cat => {
                  return (
                    <div className="form-check" key={cat}>
                      <input  className="form-check-input" type="checkbox" value={cat} id={cat} onChange={this.onCatChange}/>
                      <label className="form-check-label" htmlFor={cat}>
                        {cat}
                      </label>
                    </div>
                  )
                })}
                </div>
                <div className="form-group">
                <label htmlFor="cats">Issue Categories</label>
                {region_ids.map( reg => {
                  return (
                    <div className="form-check" key={reg}>
                      <input className="form-check-input" type="checkbox" value={reg} id={reg} onChange={this.onRegChange}/>
                      <label className="form-check-label" htmlFor={reg}>
                        {publicFacingRegion(reg)}
                      </label>
                    </div>
                  )
                })}
                </div>
                <div className="form-group">
                <label htmlFor="Access">Account Type</label>
                <div className="form-check ">
                  <input className="form-check-input" type="radio" name="access" id="radio" value={ACCESS_CODE_READ} onChange={this.onChange}/>
                  <label className="form-check-label" htmlFor="radio">Radio</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="access" id="rb" value={ACCESS_CODE_EDIT} onChange={this.onChange}/>
                  <label className="form-check-label" htmlFor="rb">Responsible Body</label>
                </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.registerAccount} data-dismiss="modal">Create Account</button>
            </div>
          </div>
        </div>
      </div>
    )
  }


  manageAUths(){
    const {authorities} = this.state;
    return (
      <div className="col-md-7">
            <div className="row">
              <div className="col-md-10">
              <h3>Registered User Authorities</h3>
              </div>
              <div className="col-md-2">
                <div className="btn btn-outline-primary" data-toggle="modal" data-target="#addAuthority">
                  <i className="fas fa-plus"></i>
                   {' '}Add Authority
                </div>
              </div>
            </div>
            <br/>
            <table className="table table-bordered table-hover">
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
                    <tr key={authority.id}  style={{cursor: 'pointer'}} onClick={
                      this.openDetail.bind(this, authority)
                    }>
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
    )
  }

  

  static getDerivedStateFromProps(props, state){
    

    //console.log(props);
    

    return null;
}

  componentDidMount(){

    const {firestore} = this.props;
    const all = [];
    firestore.collection(REF_AUTHORITIES).get().then(docs => {
      docs.forEach(doc => {
          const data = doc.data();
          data.id = doc.id;
          all.push(data);
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
      const {index} = this.state;
      
      return (
        <div className="container-main">
        {this.addAuthModal()}
        {/* {show === true ? (
          <AuthDetailModal authority={authority}/>
        ) : null} */}
        <div className="row">
          <div className="col-md-3">
          <div className="card settings-list">
            <div className="card-header">Featured
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item settings-list-item" onClick={this.changeIndex.bind(this, 0)}>Manage Authorities</li>
              <li className="list-group-item settings-list-item" onClick={this.changeIndex.bind(this, 1)}>Analytics</li>
              <li className="list-group-item settings-list-item">Feed Backs</li>
              <li className="list-group-item settings-list-item">Signout</li>
            </ul>
          </div>
          </div>
            {index === 0 ? (
              this.manageAUths()
            ) : (
              <Analytics/>
            )}
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


export default compose(firebaseConnect(),
  firestoreConnect(), withFirestore,connect((state, props) => ({
      auth: state.firebase.auth,
      settings: state.settings
  }))
)(Settings)