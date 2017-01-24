import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import SimpleButton from "../../components/SimpleButton";
import TextInput from "../../components/TextInput";
import CheckBox from "../../components/CheckBox";
import { STYLE_SUCCESS } from "../../common/Constants";
import { updateAlert } from "../../actions/AlertAction";

class AlertCardComponent extends Component {

  componentDidUpdate() {
    let curAlert = {};
    let exist = false;
    for (let i = 0; i < this.props.alerts.length; i++) {
      if (this.props.alerts[i]["ID"] == this.props.alertID) {
        curAlert = this.props.alerts[i];
        exist = true;
        break;
      }
    }
    if (exist) {
      $("#updateAlertName").val(curAlert["Name"]);
      $("#updateAlertEnabled").prop("checked", curAlert["Enabled"]);
    }

  }

  render() {
    const alertID = this.props.alertID;
    return (
      <div>
          <div className="title-bar">
            <h1 className="title-bar-title">
              <span className="d-ib">Alert</span>
            </h1>
            <p className="title-bar-description">
              <small>Pressing <font color="#469408">save</font> button will reload configurations to the alert system.</small>
            </p>
          </div>
          <div className="card">
            <div className="card-body">
              <form id="updateAlertForm" className="form form-horizontal">
                  <TextInput id="updateAlertName" name="name" title="Name" width="3"/>
                  <CheckBox id="updateAlertEnabled" name="enabled" title="Enabled" cbStyle={STYLE_SUCCESS} />
                  <div className="form-group">
                    <div className="col-md-offset-3">
                      <SimpleButton btStyle={STYLE_SUCCESS} handleClick={() => this.props.handleUpdate(alertID)} text="Save" isDisabled={this.props.alertID == 0}/>
                    </div>
                  </div>
              </form>
            </div>
          </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    alertID: state.sideMenuReducer.alertID,
    alerts: state.alertReducer.alerts,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleUpdate: ((alertID) => dispatch(updateAlert(alertID))),
  }
}

const AlertCard = connect(mapStateToProps, mapDispatchToProps)(AlertCardComponent);

export default AlertCard;