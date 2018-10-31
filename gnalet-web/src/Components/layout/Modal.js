import React, { Component } from 'react'
import Modal from 'react-bootstrap4-modal';

export default class Modal extends Component {

    state = {
        st:0,
        show:false,
        category: ''
    }

    static  getDerivedStateFromProps(props, state){

        
        console.log("Props are: ", props);
        const {st , show, category} = props;
        return {st:st,show:show,category:category}
        
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

    handleClose = () => {
        this.setState({ show: false,st:0 });
    }

    modalbuttConfirmed = (type) => {
        // const {firestore} = this.props;
        // const {category} = this.state;
        // const id = this.props.match.params.id;
        // if (type > 0 && type < 5){
        //     firestore.doc(`${REF_REPORTS}/${id}`).update({status:type}).then(x => {
        //         this.setState({show:false,st:0})
        //     }).catch(e => {
        //         alert("Unable to update report: ",e);
        //     });
        // }else if (type === 5){
        //     firestore.doc(`${REF_REPORTS}/${id}`).update({category}).then(x => {
        //         this.props.history.push('/');
        //     }).catch(e => {
        //         console.log("Error Occurred : ", e);
        //     });
        // }

        this.setState({show:false,st:0})
    
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

  render() {
    return (
      <div>
        {this.showModal}
      </div>
    )
  }
}
