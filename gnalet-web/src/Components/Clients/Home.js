import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, withFirestore} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import {REF_ANALYTICS, FIELD_UNSOLVED, FIELD_PENDING, FIELD_FLAGGED, FIELD_SOLVED} from '../../Helpers/Constants'



class Home extends Component {

    state = {

        analytics:{
          unsolved:0,
          pending:0,
          flag:0,
          solved:0
        }
        
    }

    static getDerivedStateFromProps(props, state){
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

    onclicked = (path) => {
      //e.preventDefault()
      const {history,settings} = this.props;
      const ucat = settings.categories[0];
      history.push(`/reports/${ucat}/${path}`)
    }

    componentDidMount(){
        const {firestore, auth, settings} = this.props;
        console.log("This is the auth", auth);
        console.log("This is the settings", settings);
        const {categories, access, region} = settings;
        if(categories.length > 0){
          const primecat = categories[0];
          firestore.collection(REF_ANALYTICS).doc(primecat).get().then(analytic => {
            let u = 0,p = 0,f = 0,s = 0;

          region.forEach(reg => {
            const analyticdata = analytic.data()[reg];
            console.log(analyticdata);
             u = u + analyticdata[FIELD_UNSOLVED];
             p = p + analyticdata[FIELD_PENDING];
             f = f + analyticdata[FIELD_FLAGGED];
             s = s + analyticdata[FIELD_SOLVED];
          });
          const fl = {
            unsolved: u,
            pending: p,
            flag: f,
            solved: s
          }
          console.log(fl);
          

          this.setState({analytics:fl});
          });

        }
       
        

    }

  render() {
        const {auth} = this.props;
        const {categories} = this.props.settings;
        const {unsolved, pending, solved} = this.state.analytics;
    if (auth.uid){
        return (
<div className="container main">
  <div className='row'>
    <div className='col-md-6'>
      <h4>Summary Of Events</h4>
    </div>  
  </div>

  <div className="row row-dashbord">
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Total Reports This Year</h5>
          <h6 className="card-text">{unsolved + solved + pending } Total Reports</h6>
          <button className="btn btn-primary btn-block" onClick={this.onclicked.bind(this,'all')}>See All</button>
        </div>
      </div>
    </div>
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Total Unsolved Issues</h5>
          <h6 className="card-text">{unsolved} Unsolved Reports.</h6>
          <button  className="btn btn-primary btn-block" onClick={this.onclicked.bind(this,'unsolved')}>See All</button>
        </div>
      </div>
    </div>
  </div>
  <div className="row row-dashbord-sep">
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Total Solved Issues</h5>
          <h6 className="card-text">{solved} Solved Reports</h6>
          <button className="btn btn-primary btn-block" onClick={this.onclicked.bind(this,'solved')}>See All</button>
        </div>
      </div>
    </div>
    <div className="col-sm-6">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Total Pending Issues</h5>
          <h6>{pending} Pending Reports</h6>
          <button className="btn btn-primary btn-block"onClick={this.onclicked.bind(this,'pending')} >See All</button>
        </div>
      </div>
    </div>
  </div>
  <div className='row'>
      <div className='col-md-12' style={{marginTop: '5%'}}>
        <div className="btn-group gndropdown-butt">
          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Period
          </button>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">This Month</a>
            <a className="dropdown-item" href="#">All Year</a>
          </div>
        </div>
        {categories > 1 ? (
          <div className="btn-group" style={{float: 'left'}}>
          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Issue Category
          </button>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">SANITATION</a>
            <a className="dropdown-item" href="#">FOOD</a>
          </div>
        </div>
        ) : null}
      </div>
  </div>
</div>

        )
  
    }else{

      return (<Spinner/>)
    }
  }
}

Home.propTypes = {
    firestore: PropTypes.object.isRequired,
    clients: PropTypes.array
}


export default compose(
    firestoreConnect(), withFirestore,connect((state, props) => ({
        auth: state.firebase.auth,
        settings: state.settings
    }))
)(Home)


/**
 * 
 * <div className="dropdown-menu">
        {this.state.cats.map(function(listValue){
            return <a className="dropdown-item" key={listValue.key} href="#!">{listValue.home}</a>;
          })}
        </div>
 */