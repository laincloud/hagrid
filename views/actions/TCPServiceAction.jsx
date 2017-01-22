import { ACTION_OPEN_TCP_MODAL, ACTION_CLOSE_TCP_MODAL, ACTION_FETCH_TCP_DATA, TCP_PAGE } from "../common/Constants";
import { openContentAction } from "../actions/SideMenuAction";
import hToastr from "../components/HagridToastr"
import $ from "jquery";

function openTCPModal(serviceData, mode) {
  return {
    type: ACTION_OPEN_TCP_MODAL,
    serviceData: serviceData,
    mode: mode,
  };
}

function closeTCPModal() {
  return {
    type: ACTION_CLOSE_TCP_MODAL,
    serviceData: {},
  }
}

function deleteTCPService(serviceID, alertID) {
  return function(dispatch) {
    dispatch(closeTCPModal());
    $.ajax(
      `/api/alerts/${alertID}/tcpservices/${serviceID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("TCP service has been deleted");
          dispatch(fetchTCPServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          console.log(xhr.responseText)
        }.bind(this)
      }
    )
  };
}

function updateTCPService(serviceID, alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/tcpservices/${serviceID}`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#tcpForm").serializeArray(),
        success: function() {
          hToastr.success("Update service successfully!");
          dispatch(closeTCPModal());
          dispatch(fetchTCPServices(alertID));
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

function addTCPService(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/tcpservices/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#tcpForm").serializeArray(),
        success: function() {
          hToastr.success("Add service successfully!");
          dispatch(closeTCPModal());
          dispatch(fetchTCPServices(alertID));
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

function fetchTCPServices(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, TCP_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/tcpservices/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderTCPServicesAction(alertID, data));
        },
        error: function(xhr, status, err) {
          hToastr.error(JSON.parse(xhr.responseText)["error"]);
          dispatch(renderTCPServicesAction(alertID, []));
        }
      }
    )
  }
}

function renderTCPServicesAction(alertID, services) {
  return {
    type: ACTION_FETCH_TCP_DATA,
    alertID: alertID,
    tcpServices: services,
  }
}

export {openTCPModal, closeTCPModal, deleteTCPService, addTCPService, updateTCPService, fetchTCPServices};