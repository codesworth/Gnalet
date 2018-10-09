import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import classnames from 'classnames'
import {REF_REPORTS, CASE_SUP_BODY, formatDate, getStatusFromCode, VEHICULAR} from '../../Helpers/Constants';


class ReportDetails extends Component {

    state = {
        showImage: true,
        balanceUpdateAmount: '',
        category: '',
        
    }

    
    static  getDerivedStateFromProps(props, state){

        const cat = props.match.params.category;
        return {category:cat};
    }

    statusChanged(newStatus){

    }


    onChange = (e) => this.setState({[e.target.name] : e.target.value})

    balanceSubmit = (e) => {
        e.preventDefault()
        console.log(this.state.balanceUpdateAmount);

        const {client, firestore } = this.props;
        const { balanceUpdateAmount} = this.state;
        
        const clientUpdate = {
            balance: parseFloat(balanceUpdateAmount)
        }

        firestore.update({collection:'clients', doc: client.id}, clientUpdate);
    }

    onDeleteClick = () => {
         const {client, firestore, history } = this.props

         firestore.delete({collection: 'clients', doc: client.id}).then(history.push('/'))
    }

    cateChanged = (e) => {
        e.preventDefault();
        
        const index = parseInt(e.target.value);
        let c = '';
        switch (index){
            case 1:
                c =  "VEHICULAR";
                break;
            case 2:
                c =  "CRIMES";
                break;
            case 3:
                c =  "SANITATION";
                break;
            case 4:
                c =  "POTHOLES";
                break;
            case 5:
                c =  "ECG";
                break;
            case 6:
                c =  "WATER";
                break;
            case 7:
                c =  "HFDA";
                break;
            case 8:
                c =  "GSA";
                break;
            default:
                c =  "OTHERS";
        }

        if(this.props.match.params.category !== c){
            this.setState({category:c,canupdate:true});
        }else{
            this.setState({canupdate:false});
        }
    }

    updateCategory = () => {
        const newcategory = this.state.category;
        const id = this.props.match.params.id;
        const {firestore} = this.props;
        firestore.update({collection:REF_REPORTS, id}, {category: newcategory})
    }

  render() {

    const { report } = this.props;
    const {showImage,canupdate} = this.state;
    let balanceform = '';
    const category = this.props.match.params.category;
    if(showImage){

        balanceform = (
            <div className="input-group">
                <select className="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon" onChange={this.cateChanged}>
                    <option defaultValue>{category}</option>
                    <option value="1">Accidents/Vehicular</option>
                    <option value="2">Criminal Activities</option>
                    <option value="3">Sanitation</option>
                    <option value="4">Potholes</option>
                    <option value="5">Electricity/ECG</option>
                    <option value="6">Pipes/Water</option>
                    <option value="7">Food/Drugs Board</option>
                    <option value="8">Ghana Standards Authority</option>
                    <option value="9">Others</option>
                </select>
                <div className="input-group-append">
                    <button className={classnames({
                                        'btn-primary':canupdate,
                                        'btn btn-outline-secondary': !canupdate
                                    })} type="button">Update</button>
                </div>
            </div>
        )
        /*balanceform = (
            <div className="btn-group">
                <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onSelect={this.selected}>
                    {category}
                </button>
                <button type="button" className="btn btn-light">Update</button>
                <div className="dropdown-menu">
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Accidents/Vehicular</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Public Crimes</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}}>Sanitation</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Potholes</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Electricity/ECG</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Pipes/Water</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Food/Drugs Board</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} >Ghana Standards Authority</a>
                    <a className="dropdown-item" style={{cursor:'pointer'}} /*onClick={this.cateChanged(8)}>>Others</a>
                </div>
            </div>
        )*/
    
    }else{
        balanceform = null
    }

    if(report){
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        <Link to='/' className="btn btn-link">
                            <i className="fas fa-arrow-circle-left"></i>
                            Back To Dashboard
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <div className="btn-group float-right">
                            <button className="btn btn-warning" onClick={this.statusChanged(1)}>Set Pending</button>
                            <button onClick={this.statusChanged(2)} className="btn btn-success">Set Solved</button>
                            <button onClick={this.statusChanged(100)} className="btn btn-danger">Flag Report</button>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="card">
                    <div className="card-header">
                        <h3>{"REPORT DETAILS"}</h3>
                    </div>
                    <div className="card-body">
                            <div className="row">
                                <div className="col-md-8 col-sm-6">
                                <h4>Address:{' '} <span className="text-secondary">{report.location}</span></h4>
                                </div>

                                <div className="col-md-4 col-sm-6">
                                    <h4 className="pull-right">Change Category:<span>
                                    </span>
                                        <small>
                                            <a href="#!" onClick={() => this.setState({showImage: !this.state.showImage})}>
                                                <i className="fas fa-pencil-alt">
                                                </i>
                                            </a>
                                        </small>
                                    </h4>
                                    {balanceform}
                                </div>
                            </div>
                            <hr/>
                            <ul className="list-group">
                                <li className="list-group-item">Reporter: {report.Reporter}</li>
                                <li className="list-group-item">Description: {report.description}</li>
                                <li className="list-group-item">Assembly: {report[CASE_SUP_BODY]}</li>
                                <li className="list-group-item">Date and Time: {formatDate(report.ts)}</li>
                                <li className="list-group-item">Report Status: {getStatusFromCode(report.status)}</li>
                                {report.extras !== null ? (
                                    <li className="list-group-item"> Type of Vehicle: {report.extras.VehicleType}</li>
                                ) : null}
                                {report.extras !== null ? (
                                    <li className="list-group-item"> Vehicle Number: {report.extras.VehicleNumber}</li>
                                ) : null}
                                {report.extras !== null ? (
                                    <li className="list-group-item">Color Vehicle: {report.extras.VehicleColor}</li>
                                ) : null}
                            </ul>
                        </div>
                </div>
                <div className='row'>
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <div className="view overlay hm-white-light z-depth-1-half">
                                    <img src={report.link} alt="Report Image" className="img-fluid" onClick={() => window.open(report.link)}/>
                                    <div className="mask"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <Spinner></Spinner>
        )
    }
    
  }
}

ReportDetails.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect( props => [
        { collection: REF_REPORTS, storeAs: 'report', doc: props.match.params.id}
    ]),connect(({ firestore: { ordered }}, props) => ({
        report: ordered.report && ordered.report[0]
    }))
)(ReportDetails)