import React, { Component } from "react";
import DataTable from "../components/DataTable";
import Label from "../components/Label";
import SimpleButton from "../components/SimpleButton";
import { STYLE_WARN, STYLE_SUCCESS, SIZE_EX_SMALL } from "../common/Constants";
import $ from "jquery";
import store from "../common/Store";
import { switchAlertAction } from "../actions/SideMenuAction";

export default class AlertListCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
    };
  }

  componentWillMount() {
    this.fetchAlerts();
  }


  componentDidUpdate() {
    $("#alert_table").DataTable({
      columnDefs: [{
        orderable: false,
        targets: [-1]
      }],
      dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-12'p>>",
      info: true,
      language: {
        paginate: {
          previous: '&laquo;',
          next: '&raquo;'
        }
      },
      order: [[0, "asc"]],
      searching: false,
      destroy: true,
    });
  }

  fetchAlerts() {
    $.ajax(
      `/api/alerts/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          this.setState({alerts: data})
        }.bind(this),
        error: function(xhr, status, err) {
          console.log(xhr)
        }.bind(this)
      }
    )
  }

  activeAlert(alertID) {
    if (alertID != 0) {
      store.dispatch(switchAlertAction(alertID));
    }
  }

  updateAlert(alertID) {

  }

  render() {
    const tableHeader = ["ID", "Name", "Enabled", "Actived", ""];
    const alertID = this.props.alertID;
    const tableRows = [];
    const activeAlert = this.activeAlert;
    const updateAlert = this.updateAlert;
    this.state.alerts.map(function(alert, i){
      let enabledLabel = <Label isOutline={false} labelStyle={STYLE_WARN} text="No"/>;
      if (alert["Enabled"]) {
        enabledLabel = <Label isOutline={false} labelStyle={STYLE_SUCCESS} text="Yes"/>;
      }
      let activeButton = <SimpleButton isDisabled={false} text="active" btSize={SIZE_EX_SMALL} btStyle={STYLE_SUCCESS} handleClick={activeAlert} clickParams={[alert["ID"]]}/>;
      if (alert["ID"] == alertID) {
        activeButton = <SimpleButton isDisabled={true} text="actived" btSize={SIZE_EX_SMALL} />;
      }
      let updateButton = <SimpleButton text="update" btSize={SIZE_EX_SMALL} btStyle={STYLE_SUCCESS} handleClick={updateAlert} clickParams={[alert["ID"]]}/>;

      tableRows.push([
        alert["ID"],
        alert["Name"],
        enabledLabel,
        activeButton,
        updateButton,
      ]);
    });
    return (
      <div className="card">
        <div className="card-header">
          <h2>Alerts</h2>
        </div>
        <div className="card-body">
          <DataTable tableID="alert_table" headers={tableHeader} rows={tableRows}/>
        </div>
      </div>
    )
  }
}