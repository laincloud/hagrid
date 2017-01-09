import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE, MODE_ADD } from "../../common/Constants";
import { closeGraphiteModal, deleteGraphiteService } from "../../actions/GraphiteServiceAction"

class GraphiteServiceModalComponent extends Component {

  renderDataModal() {

  }

  renderConfirmModal() {
    let serviceID = this.props.serviceData["ID"];
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete graphite service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <font color="red"> {this.props.serviceData["Name"]}</font> ?</h4>
          <p><font color="red">The operation can't be undo.</font></p>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_PRIMARY} handleClick={() => {this.props.handleDelete(serviceID)}} text="Delete"/>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {

    const renderConfirmModal = this.renderConfirmModal.bind(this);
    const renderDataModal = this.renderDataModal.bind(this);
    if (this.props.mode == MODE_DELETE) {
      return <div> {renderConfirmModal()} </div>
    } else {
      return <div> {renderDataModal()} </div>
    }

  }
}


function mapStateToProps(state) {
  return {
    isOpen: state.graphiteServiceReducer.isOpen,
    mode: state.graphiteServiceReducer.mode,
    serviceData: state.graphiteServiceReducer.serviceData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeGraphiteModal()),
    handleDelete: (id) => dispatch(deleteGraphiteService(id)),
  }
}

const GraphiteServiceModal = connect(mapStateToProps, mapDispatchToProps)(GraphiteServiceModalComponent);

export default GraphiteServiceModal;