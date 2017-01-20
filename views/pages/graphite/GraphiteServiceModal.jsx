import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import NumberInput from "../../components/NumberInput";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import Select from "../../components/Select";
import CheckBox from "../../components/CheckBox";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE } from "../../common/Constants";
import { closeGraphiteModal, deleteGraphiteService, addGraphiteService, updateGraphiteService } from "../../actions/GraphiteServiceAction";
import "bootstrap-touchspin";

class GraphiteServiceModalComponent extends Component {

  renderDataModal(isUpdate) {
    let serviceID = this.props.serviceData["ID"];
    let alertID = this.props.serviceData["AlertID"];
    const selectOptions = [
      {value: ">", text: ">"},
      {value: "<", text: "<"},
      {value: "==", text: "=="},
      {value: "!=", text: "!="},
    ];
    let submitButton = isUpdate ?
      <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleUpdate(serviceID, alertID)}} text="Update"/>
      : <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleAdd(alertID)}} text="Add"/>;
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update graphite service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="graphiteForm" className="form form-horizontal">
            <TextInput id="graphiteName" name="name" title="Name" defaultValue={isUpdate ? this.props.serviceData["Name"] : ""}/>
            <TextArea id="graphiteMetric" name="metric" title="Metric" rows="5" defaultValue={isUpdate ? this.props.serviceData["Metric"] : ""}/>
            <Select id="graphiteCheckType" name="check_type" title="Check Type" defaultValue={isUpdate ? this.props.serviceData["CheckType"] : ">"} options={selectOptions} width="3"/>
            <TextInput id="graphiteWarning" name="warning" title="Warning" defaultValue={isUpdate ? this.props.serviceData["Warning"] : ""} width="3"/>
            <TextInput id="graphiteCritical" name="critical" title="Critical" defaultValue={isUpdate ? this.props.serviceData["Critical"] : ""} width="3"/>
            <NumberInput id="graphiteCheckAttempts" name="check_attempts" title="Check Attempts" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["CheckAttempts"] : 3} minValue={1} maxValue={30} postfix="time(s)" btStyle={STYLE_SUCCESS}/>
            <NumberInput id="graphiteResendTime" name="resend_time" title="Resend Time" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["ResendTime"] : 10} minValue={0} maxValue={60} postfix="minute(s)" btStyle={STYLE_SUCCESS}/>
            <CheckBox id="graphiteEnabled" name="enabled" title="Enabled" cbStyle={STYLE_SUCCESS} isChecked={isUpdate ? this.props.serviceData["Enabled"] : false}/>
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
          <Modal.Title>Delete graphite service</Modal.Title>
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
    isOpen: state.graphiteServiceReducer.isOpen,
    mode: state.graphiteServiceReducer.mode,
    serviceData: state.graphiteServiceReducer.serviceData,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeGraphiteModal()),
    handleDelete: (serviceID, alertID) => dispatch(deleteGraphiteService(serviceID, alertID)),
    handleAdd: (alertID) => dispatch(addGraphiteService(alertID)),
    handleUpdate: (serviceID, alertID) => dispatch(updateGraphiteService(serviceID, alertID)),
  }
}

const GraphiteServiceModal = connect(mapStateToProps, mapDispatchToProps)(GraphiteServiceModalComponent);

export default GraphiteServiceModal;