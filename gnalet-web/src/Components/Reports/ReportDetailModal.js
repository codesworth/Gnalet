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

  render() {
    const { report, show } = this.state;

    if (show && report) {
      return (
        <Modal
          size="xl"
          show={show}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
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
