import React, { Component } from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, withFirestore} from 'react-redux-firebase';
import { REF_ANALYTICS, FIELD_UNSOLVED, FIELD_PENDING, FIELD_SOLVED, FIELD_FLAGGED, FIELD_DUPLICATE } from '../../Helpers/Constants';
import Spinner from '../layout/Spinner';

import { makeBigdataAnalytics } from './AnalyticCalculator';

class Analytics extends Component {

    state = {
        bigdata:null
    }

    componentWillMount(){
        const {firestore} = this.props;
        const nbigdata = [];
        firestore.collection(REF_ANALYTICS).get().then(bigdata => {
            bigdata.forEach(element => {
                const data = element.data();
                data.key = element.id;
                nbigdata.push(data);
            });
            const analysed = makeBigdataAnalytics(nbigdata);
            console.log("This is big data: ", analysed);
            this.setState({bigdata:analysed})
        })

    }



  render() {
      const {bigdata} = this.state
      
      if (bigdata){
        const {yearly,totals} = bigdata;
        return (
            <div className="col-md-10">
              <div className='row mg'>
                  <div className="col">
                      <div className="card">
                          <div className="card-header">
                              <h3>REPORT ANALYTICS</h3>
                          </div>
                          <div className="card-body">
                              
                              <table className="table table-bordered table-striped">
                                  <thead>
                                  <tr>
                                  <th>CATEGORY</th>
                                  <th>UNSOLVED</th>
                                  <th>PENDING</th>
                                  <th>SOLVED</th>
                                  <th>FLAGGED</th> 
                                  <th>DUPLICATE</th>
                                  <th>TOTAL</th>
                                  <th>% COMPLETION</th>
                                  </tr>
                                  </thead>
      
                                  <tbody>
                                      {yearly.map(data => (
                                          <tr key={data.key}>
                                              <td>
                                                  {data.key} 
                                              </td>
                                              <td>
                                                  {data[FIELD_UNSOLVED]}
                                              </td>
                                              <td>
                                                  {data[FIELD_PENDING]}
                                              </td>
                                              <td>{data[FIELD_SOLVED]}</td>
                                              <td>{data[FIELD_FLAGGED]}</td>
                                              <td>{data[FIELD_DUPLICATE]}</td>
                                              <td>{data.total}</td>
                                              <td>{data.completion}%</td>
                                          </tr>
                                      ))}
                                      <tr key="total">
                                        <td><h5>TOTALS</h5></td>
                                        <td><h5>{totals[FIELD_UNSOLVED]}</h5></td>
                                        <td><h5>{totals[FIELD_PENDING]}</h5></td>
                                        <td><h5>{totals[FIELD_SOLVED]}</h5></td>
                                        <td><h5>{totals[FIELD_FLAGGED]}</h5></td>
                                        <td><h5>{totals[FIELD_DUPLICATE]}</h5></td>
                                        <td><h5>{totals.total}</h5></td>
                                        <td><h5>{totals.completion}%</h5></td>
                                      </tr>
                                  </tbody>
                              </table>
                              </div>
                          </div>
                  </div>
              </div> 
            </div>
          )
      }else{
          return (
              <Spinner/>
          )
      }
  }
}


export default compose(
    firestoreConnect(), withFirestore,connect((state, props) => ({
        auth: state.firebase.auth,
        settings: state.settings
    }))
)(Analytics)
