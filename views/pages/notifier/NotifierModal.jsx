import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import AlertFont from "../../components/AlertFont";
import { STYLE_PRIMARY, STYLE_DEFAULT }from "../../common/Constants";
import { deleteNotifier, closeNotifierModal }from "../../actions/NotifierAction";

class NotifierModalComponent extends Component {
  render() {
    let notifierID = this.props.notifierData["ID"];
    let alertID = this.props.alertID;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete notifier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <AlertFont text={this.props.notifierData["Name"]}/> ?</h4>
          <p><AlertFont text="The operation can't be undo."/></p>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
          <SimpleButton btStyle={STYLE_PRIMARY} handleClick={() => {this.props.handleDelete(notifierID, alertID)}} text="Delete"/>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.notifierReducer.isOpen,
    notifierData: state.notifierReducer.notifierData,
    alertID: state.notifierReducer.alertID,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeNotifierModal()),
    handleDelete: (notifierID, alertID) => dispatch(deleteNotifier(notifierID, alertID)),
  }
}

const NotifierModal = connect(mapStateToProps, mapDispatchToProps)(NotifierModalComponent);

export default NotifierModal;