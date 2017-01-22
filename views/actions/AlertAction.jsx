import $ from "jquery";
import { ACTION_FETCH_ALERT_DATA } from "../common/Constants";

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

function renderAlertsAction(alerts) {
  return {
    type: ACTION_FETCH_ALERT_DATA,
    alerts: alerts,
  }
}

export {fetchAlertsAction}