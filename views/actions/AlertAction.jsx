import { ACTION_FETCH_ALERT_DATA, ACTION_OPEN_ALERT_MODAL, ACTION_CLOSE_ALERT_MODAL } from "../common/Constants";
import $ from "jquery";
import hToastr from "../components/HagridToastr";

function fetchAlertsAction() {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderAlertsAction(data));
        },
        error: function(xhr, status, err) {
          let errStruct = JSON.parse(xhr.responseText);
          if (errStruct) {
            hToastr.error(errStruct["error"]);
          } else {
            hToastr.error("Unknown error");
          }
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
          let errStruct = JSON.parse(xhr.responseText);
          if (errStruct) {
            hToastr.error(errStruct["error"]);
          } else {
            hToastr.error("Unknown error");
          }
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
          let errStruct = JSON.parse(xhr.responseText);
          if (errStruct) {
            hToastr.error(errStruct["error"]);
          } else {
            hToastr.error("Unknown error");
          }
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

function renderAlertsAction(alerts) {
  return {
    type: ACTION_FETCH_ALERT_DATA,
    alerts: alerts,
  }
}

export {fetchAlertsAction, openAlertModal, closeAlertModal, addAlert, updateAlert}