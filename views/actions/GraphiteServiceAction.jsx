import { ACTION_OPEN_GRAPHITE_MODAL, ACTION_CLOSE_GRAPHITE_MODAL, ACTION_FETCH_GRAPHITE_DATA, GRAPHITE_PAGE } from "../common/Constants";
import { openContentAction } from "../actions/SideMenuAction";
import hToastr from "../components/HagridToastr";
import $ from "jquery";
import { outputErrorMsg } from "../common/Utils";

function openGraphiteModal(serviceData, mode) {
  return {
    type: ACTION_OPEN_GRAPHITE_MODAL,
    serviceData: serviceData,
    mode: mode,
  };
}

function closeGraphiteModal() {
  return {
    type: ACTION_CLOSE_GRAPHITE_MODAL,
    serviceData: {},
  }
}

function deleteGraphiteService(serviceID, alertID) {
  return function(dispatch) {
    dispatch(closeGraphiteModal());
    $.ajax(
      `/api/alerts/${alertID}/graphiteservices/${serviceID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("Graphite service has been deleted");
          dispatch(fetchGraphiteServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  };
}

function updateGraphiteService(serviceID, alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/graphiteservices/${serviceID}`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#graphiteForm").serializeArray(),
        success: function() {
          hToastr.success("Update service successfully!");
          dispatch(closeGraphiteModal());
          dispatch(fetchGraphiteServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }

}

function addGraphiteService(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/graphiteservices/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#graphiteForm").serializeArray(),
        success: function() {
          hToastr.success("Add service successfully!");
          dispatch(closeGraphiteModal());
          dispatch(fetchGraphiteServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function fetchGraphiteServices(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, GRAPHITE_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/graphiteservices/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderGraphiteServicesAction(alertID, data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
          dispatch(renderGraphiteServicesAction(alertID, []));
        }
      }
    )
  }
}

function renderGraphiteServicesAction(alertID, services) {
  return {
    type: ACTION_FETCH_GRAPHITE_DATA,
    alertID: alertID,
    graphiteServices: services,
  }
}

export {openGraphiteModal, closeGraphiteModal, deleteGraphiteService, addGraphiteService, updateGraphiteService, fetchGraphiteServices};