import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import AlertFont from "../../components/AlertFont";
import { STYLE_PRIMARY, STYLE_DEFAULT }from "../../common/Constants";
import { deleteAdmin, closeAdminModal }from "../../actions/AdminAction";

class AdminModalComponent extends Component {
  render() {
    let adminID = this.props.adminData["ID"];
    let alertID = this.props.alertID;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete administrator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <AlertFont text={this.props.adminData["Name"]}/> ?</h4>
          <p><AlertFont text="The operation can't be undo."/></p>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
          <SimpleButton btStyle={STYLE_PRIMARY} handleClick={() => {this.props.handleDelete(adminID, alertID)}} text="Delete"/>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.adminReducer.isOpen,
    adminData: state.adminReducer.adminData,
    alertID: state.adminReducer.alertID,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeAdminModal()),
    handleDelete: (adminID, alertID) => dispatch(deleteAdmin(adminID, alertID)),
  }
}

const AdminModal = connect(mapStateToProps, mapDispatchToProps)(AdminModalComponent);

export default AdminModal;