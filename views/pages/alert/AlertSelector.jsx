import React, { Component } from "react";
import { connect } from "react-redux";
import { refreshContentAction } from "../../actions/SideMenuAction";
import { fetchAlertsAction } from "../../actions/AlertAction";
import $ from "jquery";
import "select2";

class AlertSelectorComponent extends Component {

  componentWillMount() {
    this.props.handleLoad();
  }

  componentDidUpdate() {
    const handleSelect = this.props.handleSelect;
    $("#alertSelect").select2({
      theme: "bootstrap",
      width: "100%",
      placeholder: "Select an alert",
    }).on("select2:select", function(e){
      handleSelect(e.target.value);
    });
  }

  render() {
    const currentID = this.props.currentID;
    const optionsList = [<option key="opt_0"/>];
    this.props.alerts.map(function(alert, i) {
      let option = currentID == alert["ID"] ?
        <option key={i} value={alert["ID"]} selected="selected">{alert["Name"]}</option>:
        <option key={i} value={alert["ID"]} >{alert["Name"]}</option>;
      optionsList.push(option);
    });
    return <select id="alertSelect" className="navbar-select-input">{optionsList}</select>
  }
}

function mapStateToProps(state) {
  return {
    alerts: state.alertReducer.alerts,
    currentID: state.sideMenuReducer.alertID,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleSelect: (alertID) => dispatch(refreshContentAction(alertID)),
    handleLoad: () => dispatch(fetchAlertsAction()),
  }
}

const AlertSelector = connect(mapStateToProps, mapDispatchToProps)(AlertSelectorComponent);

export default AlertSelector;