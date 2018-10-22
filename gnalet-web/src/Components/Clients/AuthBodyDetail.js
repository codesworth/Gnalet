import React, { Component } from 'react'
import {facingCategoryname, publicFacingRegion, REF_AUTHORITIES, ACCESS_CODE_MASTER} from '../../Helpers/Constants';

import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { firestoreConnect, withFirestore} from 'react-redux-firebase';
import { compose } from 'redux';
import Spinner from '../layout/Spinner';


class AuthBodyDetail extends Component {

    state = {
        authority:null
    }

    // static getDerivedStateFromProps(props, state){
    //     const {authority} = props;
    
    //     console.log("The authority is: ",authority);
        
    
    //    return {authority:authority};
    // }

    componentDidMount(){
        const {history} = this.props;
        const {access} = this.props.settings;
        if(access !== ACCESS_CODE_MASTER){
            history.push('/settings');
        }else{
            const {firestore} = this.props
            firestore.collection(REF_AUTHORITIES).doc(this.props.match.params.id).get().then(authority => {
                this.setState({authority:authority.data()});
            })
        }
        
    }


  renders() {

    const {region, categories, username} = this.props.authority;
      return (
        <div className="modal fade bd-example-modal-lg" show={true.toString()} aria-labelledby="myLargeModalLabel" id="myModal" role="dialog"  aria-hidden="false">
          <div className="modal-dialog modal-lg">
              <div className="modal-content">
            
                  <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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
  
                  <div className="modal-footer">
                      <button data-dismiss="modal" className="btn btn-danger mr-auto">Delete Account</button>
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                      <button data-dismiss="modal" type="button" className="btn btn-primary">Update Details</button>
                      
                  </div>
              </div>
              
          </div>
          </div>

          
      )    
    
  }

  render(){
      if (this.state.authority !== null){
          return this.renderAuthority();
      }else{
          return (
            <Spinner/>
          )
      }
  }

  renderAuthority(){
    //console.log("Hello therw",this.state);
    const {region, categories, username} = this.state.authority;
    return (
        <div className="container-main">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h3>Account Details</h3>
                        </div>
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
        </div>
    )
  }


  


//   render(){
//       if (this.state.authority === null || this.state.authority === undefined){
//             return null;
//       }else{
//           this.renderAuthority();
//       }
//   }
}

AuthBodyDetail.propTypes = {
    firestore: PropTypes.object.isRequired
}


export default compose(
    firestoreConnect(), withFirestore,connect((state, props) => ({
        auth: state.firebase.auth,
        settings: state.settings
    }))
)(AuthBodyDetail)
