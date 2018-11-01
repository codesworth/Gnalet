import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, withFirestore} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import * as Constants from '../../Helpers/Constants'




class Reports extends Component {

    state = {
        issues: [],
        notFound:false,
        isFetching:true
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

    componentDidMount(){
        const issues = [];
        const isFetching = true;
        const {firestore, settings} = this.props;
        const { categories, region } = settings;
        const {sort,regcat} = this.props.match.params;
        const regcarray = regcat.split('&');
        let freg = ''; let fcat = ''
        if(regcarray.length === 2){
            
            let reg = regcarray[0]; let cat = regcarray[1];
            region.includes(reg) ? freg = reg : freg = region[0];
            categories.includes(cat) ? fcat = cat : fcat = categories[0];
            const status = this.getStatusFromSort(sort);
            //console.log("We got here: ",fcat);
            
        let query = firestore.collection(Constants.REF_REPORTS).where(Constants.FIELD_CATEGORY, "==",fcat).where(Constants.FIELD_SUPBODY,"==",freg).where(Constants.CASE_STATUS, "<",4);
        if(status  < 3){
             query = query.where(Constants.CASE_STATUS,"==",status);  
             //console.log("Fetching: ");
        }
        
        query.get().then(querysnap => {
            
            querysnap.forEach(element => {
                const doc = element.data();
                issues.push(doc);
                //console.log("Pushing: ");
            });

            this.setState({issues:issues,isFetching:false});
        });
        }else{
            this.setState({notFound:true,isFetching:false});
        }


    }

  render() {
        const {auth} = this.props;
        const category = this.props.match.params.regcat;
        //console.log("Catwegory is ",category);
    if (auth.uid && !this.state.isFetching){
        const {issues} = this.state;
        if (issues.length == 0){
            return (
                <div className='row mg'>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3>REPORTS</h3>
                            </div>
                            <div className="card-body">
                                <h1> NO REPORTS AVAILABLE</h1>
                            </div>
                        </div>
                    </div>
                </div> 
            )
        }
        return (
            <div className="container-main">
                <div className="row">
                    <div className='col-md-4'>
                         <h2>{' '}<i className="fas fa-users"></i> REPORTS{' '}</h2>

                    </div>

                    <div className='col-md-8'>
                        <h5 className="text-right text-secondary">  {' '}
                            <span className="text-primary">
                                {issues.length} REPORTS
                            </span>
                        </h5>
                    </div>
                </div>
                <div className="col-xs-12">
                <table className=" table  table-striped">
                    <thead>
                    <tr>
                       <th>Issue</th>
                       <th>Sender</th>
                       <th>Assembly</th>
                       <th>Date And Time</th>
                       <th>Status</th> 
                        <th>Details</th>
                       
                    </tr>
                    </thead>

                    <tbody>
                        {issues.map(issue => (
                            <tr key={issue.id}>
                                <td>
                                    {issues.indexOf(issue) + 1} {''} 
                                </td>
                                <td>
                                    {issue.Reporter}
                                </td>
                                <td>
                                    {issue[Constants.FIELD_SUPBODY]}
                                </td>
                                <td>{Constants.formatDate(issue.ts)}</td>
                                <td>{Constants.getStatusFromCode(issue.status)}</td>
                                <td><Link to={`/report/${category}/${issue.id}`} className="btn btn-secondary btn-sm">
                                    <i className="fas fa-arrow-circle-right"></i>Details
                                </Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        )
    }else{
        return (<Spinner/>)
    }
  }

    getStatusFromSort(sort){
      switch (sort){
        case 'unsolved':
            return 0;
        case 'pending':
            return 1;
        case 'solved':
            return 2;
        default:
            return 100
      }
    }
}

Reports.propTypes = {
    firestore: PropTypes.object.isRequired,
    clients: PropTypes.array
}


export default compose(
    firestoreConnect(), withFirestore,connect((state, props) => ({
        auth: state.firebase.auth,
        settings: state.settings
    }))
)(Reports)
