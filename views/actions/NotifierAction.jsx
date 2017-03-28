import $ from "jquery";
import hToastr from "../components/HagridToastr";
import { ACTION_FETCH_NOTIFIER_DATA, NOTIFIER_PAGE, ACTION_OPEN_NOTIFIER_MODAL, ACTION_CLOSE_NOTIFIER_MODAL } from "../common/Constants";
import { openContentAction } from "./SideMenuAction"
import { outputErrorMsg } from "../common/Utils";

function openNotifierModal(notifierData) {
  return {
    type: ACTION_OPEN_NOTIFIER_MODAL,
    notifierData: notifierData,
  };
}

function closeNotifierModal() {
  return {
    type: ACTION_CLOSE_NOTIFIER_MODAL,
    notifierData: {},
  }
}

function addNotifier(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/notifiers/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#notifierForm").serializeArray(),
        success: function() {
          hToastr.success("Add notifier successfully!");
          dispatch(fetchNotifiers(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function deleteNotifier(notifierID, alertID) {
  return function(dispatch) {
    dispatch(closeNotifierModal());
    $.ajax(
      `/api/alerts/${alertID}/notifiers/${notifierID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("Notifier has been deleted!");
          dispatch(fetchNotifiers(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function fetchNotifiers(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, NOTIFIER_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/notifiers/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderNotifiersAction(alertID, data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
          dispatch(renderNotifiersAction(alertID, []));
        }
      }
    )
  }
}

function renderNotifiersAction(alertID, notifiers) {
  return {
    type: ACTION_FETCH_NOTIFIER_DATA,
    alertID: alertID,
    notifiers: notifiers,
  }
}

export {addNotifier, deleteNotifier, fetchNotifiers, openNotifierModal, closeNotifierModal};