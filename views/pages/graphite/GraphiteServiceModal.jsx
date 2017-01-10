import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import SimpleButton from "../../components/SimpleButton";
import NumberInput from "../../components/NumberInput";
import { STYLE_DEFAULT, STYLE_SUCCESS, STYLE_PRIMARY } from "../../common/Constants";
import { MODE_DELETE, MODE_UPDATE } from "../../common/Constants";
import { closeGraphiteModal, deleteGraphiteService } from "../../actions/GraphiteServiceAction";
import "bootstrap-touchspin";

class GraphiteServiceModalComponent extends Component {

  renderDataModal(isUpdate) {
    let serviceID = this.props.serviceData["ID"];
    let alertID = this.props.serviceData["AlertID"];
    return (
      <Modal show={this.props.isOpen} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update graphite service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form form-horizontal">
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteName">Name</label>
              <div className="col-sm-6">
                <input id="graphiteName" name="name" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["Name"] : ""}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteMetric">Metric</label>
              <div className="col-sm-6">
                <textarea id="graphiteMetric" name="metric" rows="5" className="form-control" defaultValue={isUpdate ? this.props.serviceData["Metric"] : ""}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteCheckType">Check Type</label>
              <div className="col-sm-3">
                <select id="graphiteCheckType" name="check_type" className="form-control" defaultValue={isUpdate ? this.props.serviceData["CheckType"] : ">"}>
                  <option value='>'> &gt; </option>
                  <option value='<'> &lt; </option>
                  <option value='=='> &#61;&#61; </option>
                  <option value='!='> &#33;&#61; </option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteWarning">Warning</label>
              <div className="col-sm-3">
                <input id="graphiteWarning" name="warning" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["Warning"] : ""}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteCritical">Critical</label>
              <div className="col-sm-3">
                <input id="graphiteCritical" name="critical" className="form-control" type="text" defaultValue={isUpdate ? this.props.serviceData["Critical"] : ""}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteCheckAttempts">Check Attempts</label>
              <div className="col-sm-6">
                <NumberInput inputID="graphiteCheckAttempts" inputName="check_attempts" className="form-control" type="text" startValue={isUpdate ? this.props.serviceData["CheckAttempts"] : 3} minValue={1} maxValue={30} postfix="time(s)" btStyle={STYLE_SUCCESS}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label" htmlFor="graphiteResendTime">Resend Time</label>
              <div className="col-sm-6">
                <NumberInput inputID="graphiteResendTime" inputName="resend_time" className="form-control" type="text" startValue={isUpdate ? this.props.serviceData["ResendTime"] : 10} minValue={0} maxValue={60} postfix="minute(s)" btStyle={STYLE_SUCCESS}/>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-3 control-label">Enabled</label>
              <div className="col-sm-6">
                <div className="custom-controls-stacked m-t">
                <label className="custom-control custom-control-success custom-checkbox">
                  <input id="graphiteEnabled" name="enabled" className="custom-control-input" type="checkbox" defaultChecked="checked"/>
                    <span className="custom-control-indicator"/>
                </label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => {this.props.handleDelete(serviceID, alertID)}} text="Update"/>
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
  }
}

const GraphiteServiceModal = connect(mapStateToProps, mapDispatchToProps)(GraphiteServiceModalComponent);

export default GraphiteServiceModal;