import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'

import classnames from 'classnames'
import {REF_REPORTS, CASE_SUP_BODY, formatDate, getStatusFromCode, VEHICULAR, facingCategoryname} from '../../Helpers/Constants';



class ReportDetails extends Component {

    state = {
        showImage: false,
        balanceUpdateAmount: '',
        category: '',
        st:0,
        show:false
        
    }

    
    static  getDerivedStateFromProps(props, state){

        const cat = props.match.params.regcat;
        return {category:cat};
    }

    statusChanged = () => {
        const newStatus = this.state.st;
        console.log("I have been called with status: ",newStatus)
        this.setState({st:0, show:false});
        const { firestore, } = this.props;
        //firestore.collection(REF_REPORTS).doc(this.props.match.params.id).update({status:newStatus});
    }

    statusWillChange = (status) => {
        this.setState({st:status, show:true});
        console.log("New Sttua, ", status);
    }


    onChange = (e) => this.setState({[e.target.name] : e.target.value})




    cateChanged = (e) => {
        e.preventDefault();
        
        
        const index = parseInt(e.target.value);
        let c = '';
        console.log(index);
        switch (index){
            case 0:
                c = this.props.match.params.category;
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

        console.log(this.props.match.params.category );
        
        if(this.props.match.params.category !== c){
            console.log("New Category is,",c);
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

    handleClose() {
        this.setState({ show: false });
    }

    showModal(){
        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        You are about to change the status of this Report. Please confirm that the report has been identified and addressed 
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.statusChanged.bind(this)}>Update Status</button>
                    </div>
                    </div>
                </div>
            </div>
        )
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
                    <option value="0">{facingCategoryname(category)}</option>
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

    
    }else{
        balanceform = null
    }

    if(report){
        return (
            <div>
                {this.showModal()}
                <div className="row">
                    <div className="col-md-6">
                        <Link to='/' className="btn btn-link">
                            <i className="fas fa-arrow-circle-left"></i>
                            Back To Dashboard
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <div className="btn-group float-right">
                            <button className="btn btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={this.statusWillChange.bind(this,1)}>Set Pending</button>
                            <button data-toggle="modal" data-target="#exampleModal" onClick={this.statusWillChange.bind(this,2)} className="btn btn-success">Set Solved</button>
                            <button data-toggle="modal" data-target="#exampleModal" style={{outline:"false"}} onClick= {this.statusWillChange.bind(this,100)} className="btn btn-danger">Flag Report</button>
                        </div>
                        <div>
                        
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
                                <Link className="btn btn-outline-info" to={`location/${report.latitude}&${report.longitude}`}>Show On Map{'  '}<i className="fas fa-map-marker-alt"></i></Link>
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
                <div className='row mg'>
                    <div className="col">
                        <div className="card">
                            <div className="card-header">
                                <h3>REPORT IMAGE</h3>
                            </div>
                            <div className="card-body">
                                <div className="view overlay hm-white-light z-depth-1-half">
                                    {report.link !== "" ? (
                                        <img src={report.link} alt="Report Image" className="img-fluid" onClick={() => window.open(report.link)}/>
                                    ) : (
                                        <h3>NO IMAGE ATTACHED TO THIS REPORT</h3>
                                    )}
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