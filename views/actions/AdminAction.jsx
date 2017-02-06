import $ from "jquery";
import hToastr from "../components/HagridToastr";
import { ACTION_FETCH_ADMIN_DATA, ADMIN_PAGE, ACTION_CLOSE_ADMIN_MODAL, ACTION_OPEN_ADMIN_MODAL } from "../common/Constants";
import { openContentAction } from "./SideMenuAction"
import { outputErrorMsg } from "../common/Utils";

function openAdminModal(adminData) {
  return {
    type: ACTION_OPEN_ADMIN_MODAL,
    adminData: adminData,
  };
}

function closeAdminModal() {
  return {
    type: ACTION_CLOSE_ADMIN_MODAL,
    adminData: {},
  }
}

function addAdmin(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/admins/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#adminForm").serializeArray(),
        success: function() {
          hToastr.success("Add administrator successfully!");
          dispatch(fetchAdmins(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function deleteAdmin(adminID, alertID) {
  return function(dispatch) {
    dispatch(closeAdminModal());
    $.ajax(
      `/api/alerts/${alertID}/admins/${adminID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("Administrator has been deleted!");
          dispatch(fetchAdmins(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function fetchAdmins(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, ADMIN_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/admins/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderAdminsAction(alertID, data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
          dispatch(renderAdminsAction(alertID, []));
        }
      }
    )
  }
}

function renderAdminsAction(alertID, admins) {
  return {
    type: ACTION_FETCH_ADMIN_DATA,
    alertID: alertID,
    admins: admins,
  }
}

export {addAdmin, deleteAdmin, fetchAdmins, openAdminModal, closeAdminModal};