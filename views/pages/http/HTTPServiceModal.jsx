import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect, Provider } from "react-redux";
import store from "../../common/Store";
import SimpleButton from "../../components/SimpleButton";
import NumberInput from "../../components/NumberInput";
import TextInput from "../../components/TextInput";
import CheckBox from "../../components/CheckBox";
import AlertFont from "../../components/AlertFont";
import HTTPServiceTestTextArea from "./HTTPServiceTestTextArea";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY, STYLE_DANGER } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE } from "../../common/Constants";
import { closeHTTPModal, deleteHTTPService, addHTTPService, updateHTTPService, testHTTPService } from "../../actions/HTTPServiceAction";
import "bootstrap-touchspin";

class HTTPServiceModalComponent extends Component {

  renderDataModal(isUpdate) {
    let serviceID = this.props.serviceData["ID"];
    let alertID = this.props.serviceData["AlertID"];

    let submitButton = isUpdate ?
      <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleUpdate(serviceID, alertID)}} text="Update"/>
      : <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleAdd(alertID)}} text="Add"/>;
    let testButton = <SimpleButton btStyle={STYLE_DANGER} handleClick={() => {this.props.handleTest(alertID)}} text="Test"/>;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isUpdate ? "Update" : "Add"} HTTP service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="httpForm" className="form form-horizontal">
            <TextInput id="httpName" name="name" title="Name" width="9" defaultValue={isUpdate ? this.props.serviceData["Name"] : ""}/>
            <div className="form-group has-default">
              <label className="col-sm-3 control-label" htmlFor="httpParameters">Parameters</label>
              <div className={`col-sm-9`}>
                <textarea id="httpParameters" name="parameters" rows="10" width="9" className="form-control" defaultValue={isUpdate ? this.props.serviceData["Parameters"] : ""} />
                <p className="help-block"> <a href="https://www.monitoring-plugins.org/doc/man/check_http.html" target="_blank">Read the check_http manual.</a></p>
              </div>

            </div>
            <NumberInput id="httpCheckAttempts" name="check_attempts" title="Check Attempts" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["CheckAttempts"] : 3} minValue={1} maxValue={30} postfix="time(s)" btStyle={STYLE_SUCCESS}/>
            <NumberInput id="httpResendTime" name="resend_time" title="Resend Time" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["ResendTime"] : 10} minValue={0} maxValue={60} postfix="minute(s)" btStyle={STYLE_SUCCESS}/>
            <CheckBox id="httpEnabled" name="enabled" title="Enabled" cbStyle={STYLE_SUCCESS} isChecked={isUpdate ? this.props.serviceData["Enabled"] : false}/>
            <Provider store={store}>
              <HTTPServiceTestTextArea />
            </Provider>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {submitButton}
          {testButton}
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
          <Modal.Title>Delete HTTP service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Do you really want to delete <AlertFont text={this.props.serviceData["Name"]}/> ?</h4>
          <p><AlertFont text="The operation can't be undo."/></p>
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
    isOpen: state.httpServiceReducer.isOpen,
    mode: state.httpServiceReducer.mode,
    serviceData: state.httpServiceReducer.serviceData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeHTTPModal()),
    handleDelete: (serviceID, alertID) => dispatch(deleteHTTPService(serviceID, alertID)),
    handleAdd: (alertID) => dispatch(addHTTPService(alertID)),
    handleUpdate: (serviceID, alertID) => dispatch(updateHTTPService(serviceID, alertID)),
    handleTest: (alertID) => dispatch(testHTTPService(alertID)),
  }
}

const HTTPServiceModal = connect(mapStateToProps, mapDispatchToProps)(HTTPServiceModalComponent);

export default HTTPServiceModal;