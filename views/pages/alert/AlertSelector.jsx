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

  componentDidMount() {
    $("#alertSelect").select2({
      theme: "bootstrap",
      width: "100%",
    })
  }

  render() {
    const currentID = this.props.currentID;
    const handleChange = this.handleChange.bind(this);
    const optionList = this.props.alerts.length > 0 ? this.props.alerts.map(function(alert, i){
      if (currentID == alert["ID"]) {
        return <option key={i} value={alert["ID"]} selected="selected">{alert["Name"]}</option>
      } else {
        return <option key={i} value={alert["ID"]} >{alert["Name"]}</option>
      }
    }) : <option value="0" >No alerts available</option>;
    return <select id="alertSelect" className="select2-hidden-accessible navbar-search-input" onChange={handleChange}>{optionList}</select>
  }

  handleChange() {
    this.props.handleSelect($("#alertSelect").val());
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