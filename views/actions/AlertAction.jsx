import { ACTION_FETCH_ALERT_DATA, ACTION_OPEN_ALERT_MODAL, ACTION_CLOSE_ALERT_MODAL } from "../common/Constants";
import $ from "jquery";
import hToastr from "../components/HagridToastr";
import { outputErrorMsg } from "../common/Utils";
import { switchAlertAction } from "./SideMenuAction";

function fetchAlertsAction() {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(chooseFirstAlert(data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        },
      }
    )
  }
}

function addAlert() {
  return function(dispatch) {
    $.ajax(
      `/api/alerts`,
      {
        method: "POST",
        dataType: "json",
        data: $("#addAlertForm").serializeArray(),
        success: function() {
          hToastr.success("Add alert successfully!");
          dispatch(closeAlertModal());
          dispatch(fetchAlertsAction());
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function updateAlert(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#updateAlertForm").serializeArray(),
        success: function() {
          hToastr.success("Save alert successfully!");
          dispatch(fetchAlertsAction());
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function openAlertModal() {
  return {
    type: ACTION_OPEN_ALERT_MODAL,
  }
}

function closeAlertModal() {
  return {
    type: ACTION_CLOSE_ALERT_MODAL,
  }
}

function chooseFirstAlert(alerts) {
  return function(dispatch) {
    if (alerts.length > 0) {
      dispatch(switchAlertAction(alerts[0]["ID"]));
    }
    dispatch(renderAlertsAction(alerts));
  }
}

function renderAlertsAction(alerts) {
  return {
    type: ACTION_FETCH_ALERT_DATA,
    alerts: alerts,
  }
}

export {fetchAlertsAction, openAlertModal, closeAlertModal, addAlert, updateAlert}