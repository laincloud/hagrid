import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import NumberInput from "../../components/NumberInput";
import TextInput from "../../components/TextInput";
import CheckBox from "../../components/CheckBox";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE } from "../../common/Constants";
import { closeTCPModal, deleteTCPService, addTCPService, updateTCPService } from "../../actions/TCPServiceAction";
import "bootstrap-touchspin";

class TCPServiceModalComponent extends Component {

  renderDataModal(isUpdate) {
    let serviceID = this.props.serviceData["ID"];
    let alertID = this.props.serviceData["AlertID"];

    let submitButton = isUpdate ?
      <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleUpdate(serviceID, alertID)}} text="Update"/>
      : <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleAdd(alertID)}} text="Add"/>;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate ? "Update" : "Add"} graphite service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="tcpForm" className="form form-horizontal">
            <TextInput id="tcpName" name="name" title="Name" defaultValue={isUpdate ? this.props.serviceData["Name"] : ""}/>
            <TextInput id="tcpHost" name="host" title="Host" defaultValue={isUpdate ? this.props.serviceData["Host"] : ""}/>
            <NumberInput id="tcpPort" name="port" title="Port" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["Port"] : 8080} minValue={1} maxValue={65535} btStyle={STYLE_SUCCESS}/>
            <NumberInput id="tcpCheckAttempts" name="check_attempts" title="Check Attempts" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["CheckAttempts"] : 3} minValue={1} maxValue={30} postfix="time(s)" btStyle={STYLE_SUCCESS}/>
            <NumberInput id="tcpResendTime" name="resend_time" title="Resend Time" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["ResendTime"] : 10} minValue={0} maxValue={60} postfix="minute(s)" btStyle={STYLE_SUCCESS}/>
            <CheckBox id="tcpEnabled" name="enabled" title="Enabled" cbStyle={STYLE_SUCCESS} isChecked={isUpdate ? this.props.serviceData["Enabled"] : false}/>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {submitButton}
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>

        </Modal.Footer>
      </Modal>
    )
  }

  renderConfirmModal() {
    let serviceID = this.props.serviceData["ID"];
    let alertID = this.props.serviceData["AlertID"];
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete TCP service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <font color="red"> {this.props.serviceData["Name"]}</font> ?</h4>
          <p><font color="red">The operation can't be undo.</font></p>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_DEFAULT} handleClick={this.props.handleClose} text="Close"/>
          <SimpleButton btStyle={STYLE_PRIMARY} handleClick={() => {this.props.handleDelete(serviceID, alertID)}} text="Delete"/>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {

    const renderConfirmModal = this.renderConfirmModal.bind(this);
    const renderDataModal = this.renderDataModal.bind(this);
    switch (this.props.mode) {
      case MODE_DELETE:
        return <div>{renderConfirmModal()}</div>;
      case MODE_UPDATE:
        return <div>{renderDataModal(true)}</div>;
      default:
        return <div>{renderDataModal(false)}</div>;
    }
  }
}


function mapStateToProps(state) {
  return {
    isOpen: state.tcpServiceReducer.isOpen,
    mode: state.tcpServiceReducer.mode,
    serviceData: state.tcpServiceReducer.serviceData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeTCPModal()),
    handleDelete: (serviceID, alertID) => dispatch(deleteTCPService(serviceID, alertID)),
    handleAdd: (alertID) => dispatch(addTCPService(alertID)),
    handleUpdate: (serviceID, alertID) => dispatch(updateTCPService(serviceID, alertID)),
  }
}

const TCPServiceModal = connect(mapStateToProps, mapDispatchToProps)(TCPServiceModalComponent);

export default TCPServiceModal;