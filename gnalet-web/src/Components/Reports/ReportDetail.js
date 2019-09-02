import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, withFirestore} from 'react-redux-firebase';
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import Modal from 'react-bootstrap4-modal';

import classnames from 'classnames'
import {REF_REPORTS, CASE_SUP_BODY, formatDate, getStatusFromCode, facingCategoryname, ACCESS_CODE_READ} from '../../Helpers/Constants';
import { firestore } from 'firebase';



class ReportDetails extends Component {

    state = {
        showImage: false,
        category: '',
        show: false,
        st:0,
        selected:null
    }


    componentDidMount(){

        const 
    }

    // statusChanged = () => {
    //     // const newStatus = this.state.st;
    //     //console.log("I have been called with status: ",newStatus)
    //     this.setState({st:0, show:false});
    //    // const { firestore, } = this.props;
    //     //firestore.collection(REF_REPORTS).doc(this.props.match.params.id).update({status:newStatus});
    // }

    statusWillChange = (status) => {
        this.setState({st:status, show:true});
        //console.log("New Sttua, ", status);
    }


    onChange = (e) => this.setState({[e.target.name] : e.target.value})




    cateChanged = (e) => {
        e.preventDefault();
        
        console.log("The state is now: ", this.state);
        const index = parseInt(e.target.value,10);
        let c = '';
        //console.log(index);
        switch (index){
            case 0:
                c = this.props.match.params.category;
                break;
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

        console.log("The state is now: ", this.state);
        //console.log(this.props.match.params.category );
        
        if(this.props.match.params.category !== c){
            console.log("New Category is,",c);
            this.setState({category:c,canupdate:true});
        }else{
            this.setState({canupdate:false});
        }

        console.log("The state is now: ", this.state);
    }

    showCatModal = () => {
        this.setState({showCat:true});
    }

    updateCategory = () => {
        const {category} = this.state;
        console.log("The new category is: ",category);
        const id = this.props.match.params.id;
        const {firestore} = this.props;
        console.log("The things are: ", category)
        firestore.doc(`${REF_REPORTS}/${id}`).update({category}).then(x => {
            //console.log("The update was succesful: ",x);
            this.props.history.push('/');
        }).catch(e => {
            console.log("Error Occurred : ", e);
        });
    }

    handleClose = () => {
        this.setState({ show: false,st:0 });
    }

    modalbuttConfirmed = (type) => {
        const {firestore,history} = this.props;
        const {category} = this.state;
        const id = this.props.match.params.id;
        if (type > 0 && type < 5){
            firestore.doc(`${REF_REPORTS}/${id}`).update({status:type}).then(x => {
                this.setState({show:false,st:0})
            }).catch(e => {
                alert("Unable to update report: ",e);
            });
        }else if (type === 5){
            firestore.doc(`${REF_REPORTS}/${id}`).update({category}).then(x => {
                console.log("Category Chnged");
                history.push('/');
            }).catch(e => {
                console.log("Error Occurred : ", e);
            });
        }
    
    }

    showModal(){
        const {show,st} = this.state;
        return(
            <Modal visible={show}>
                <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{this.modalHeaderString(st)}</h5>
                        <button type="button" className="close" onClick={this.handleClose.bind(this)} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                         {this.modalDetailString(st)}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={this.handleClose.bind(this)}>Close</button>
                        <button type="button" className="btn btn-primary"  onClick={this.modalbuttConfirmed.bind(this,st)}>CONFIRM</button>
                    </div>
            </Modal>
        )
    }

    modalHeaderString(type){
        switch (type){
            case 1:
                return "UPDATE REPORT STATUS - PENDING";
            case 2:
                return "UPDATE REPORT STATUS - SOLVED";
            case 3:
                return "FLAG REPORT";
            case 4:
                return "MARK AS DUPLICATE REPORT";
            case 5:
                return "CHANGE REPORT CATEGORY"
            default:
                return ""
        }
    }

    modalDetailString(type){
        switch (type){
            case 1:
                return "You are about to change the status of this report to Pending. Please confirm that the report has been identified is being addressed";
            case 2:
                return "You are about to change the status of this report to Solved. Please confirm that the report has been identified and resolved"
            case 3:
                return "You are about to flag this report as inaprpriate. Consider reasigning the report to the next appropriate Responsible body if the report is of social concern. Flagged reports will no longer appear in your list of issues";
            case 4:
                return "You are about to mark this issue as a duplicate. Please confirm that this issue has already been identified and addressed elsewhere. Duplicate issues will not appear in your list of issues";
            case 5:
                return "You are about to change the category of this Report. Changing category will reassign this report to the next appropriate responsible body you have selected. The report will no longer be displayed in your list of issues"
            default:
                return ""
        }
    }

    // showModalsss(){
    //     return (
    //         <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    //             <div className="modal-dialog" role="document">
    //                 <div className="modal-content">
    //                 <div className="modal-header">
    //                     <h5 className="modal-title" id="exampleModalLabel">Update Report</h5>
    //                     <button type="button" className="close" data-dismiss="modal" aria-label="Close">
    //                     <span aria-hidden="true">&times;</span>
    //                     </button>
    //                 </div>
    //                 <div className="modal-body">
    //                     You are about to change the status of this Report. Please confirm that the report has been identified and addressed 
    //                 </div>
    //                 <div className="modal-footer">
    //                     <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
    //                     <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.statusChanged.bind(this)}>Update Status</button>
    //                 </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    popBack = () => {
        window.history.back();
    }

  render() {

    const { report, auth } = this.props;
    const {showImage,canupdate} = this.state;
    const access =  10000;
    let balanceform = '';
    const category = report.category;
    if(showImage){

        balanceform = (
            <div className="input-group">
                <select className="custom-select" id="inputGroupSelect04" aria-label="Example select with button addon" onChange={this.cateChanged.bind(this)}>
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
                                    })} type="button" onClick={this.statusWillChange.bind(this,5)}>Update</button>
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
                        <a onClick={this.popBack.bind(this)}className="btn btn-link">
                            <i className="fas fa-arrow-circle-left"></i>
                            Back To Dashboard
                        </a>
                    </div>
                    {access > ACCESS_CODE_READ ? (
                                            <div className="col-md-6">
                                            <div className="btn-group float-right">
                                                <button className="btn btn-warning" data-toggle="modal" data-target="#exampleModal" onClick={this.statusWillChange.bind(this,1)}>Set Pending</button>
                                                <button data-toggle="modal" data-target="#exampleModal" onClick={this.statusWillChange.bind(this,2)} className="btn btn-success">Set Solved</button>
                                                <button data-toggle="modal" data-target="#exampleModal" onClick={this.statusWillChange.bind(this,4)} className="btn btn-secondary">Mark Duplicate</button>
                                                <button onClick= {this.statusWillChange.bind(this,3)} className="btn btn-danger">Flag Report</button>
                                            </div>
                                            <div>
                                            
                                            </div>
                                        </div>
                    ) : null}
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

                                {access > ACCESS_CODE_READ ? (
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
                                ) : null}
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
                                        <img src={report.link} className="img-fluid" onClick={() => window.open(report.link)}/>
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

export const mapStateToProps = state = ({
    auth:state.auth,
    report:state.reports.selected
})

export default connect()(ReportDetails)