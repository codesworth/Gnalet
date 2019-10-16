import React, { Component } from "react";
import { Modal } from "react-bootstrap";

import ReportDetails from "./ReportDetail";
class ReportDetailModal extends Component {
  constructor() {
    super();
    this.state = {
      report: null,
      show: false
    };
  }

  componentDidMount() {
    const { report, show } = this.props;
    this.setState({ report, show });
  }

  componentWillReceiveProps(nextProps) {
    const { report, show } = nextProps;
    this.setState({ report, show });
  }

  hideModal = () => {
    const { hide } = this.props;
    hide();
    this.setState({ show: false });
  };

  render() {
    const { report, show } = this.state;

    if (show && report) {
      return (
        <Modal
          size="xl"
          onHide={this.hideModal.bind(this)}
          show={show}
          aria-labelledby="example-modal-sizes-title-xl"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-xl">
              Report Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReportDetails report={report}></ReportDetails>
          </Modal.Body>
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default ReportDetailModal;
