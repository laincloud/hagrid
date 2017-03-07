import { ACTION_OPEN_HTTP_MODAL, ACTION_CLOSE_HTTP_MODAL, ACTION_FETCH_HTTP_DATA, ACTION_FETCH_HTTP_TEST, HTTP_PAGE } from "../common/Constants";
import { openContentAction } from "../actions/SideMenuAction";
import hToastr from "../components/HagridToastr";
import $ from "jquery";
import { outputErrorMsg } from "../common/Utils";

function openHTTPModal(serviceData, mode) {
  return {
    type: ACTION_OPEN_HTTP_MODAL,
    serviceData: serviceData,
    mode: mode,
  };
}

function closeHTTPModal() {
  return function(dispatch) {
    dispatch(renderHTTPTestOutputAction(""));
    dispatch({
        type: ACTION_CLOSE_HTTP_MODAL,
        serviceData: {},
    });
  };
}

function deleteHTTPService(serviceID, alertID) {
  return function(dispatch) {
    dispatch(closeHTTPModal());
    $.ajax(
      `/api/alerts/${alertID}/httpservices/${serviceID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("HTTP service has been deleted");
          dispatch(fetchHTTPServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  };
}

function updateHTTPService(serviceID, alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/httpservices/${serviceID}`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#httpForm").serializeArray(),
        success: function() {
          hToastr.success("Update service successfully!");
          dispatch(closeHTTPModal());
          dispatch(fetchHTTPServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }

}

function addHTTPService(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/httpservices/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#httpForm").serializeArray(),
        success: function() {
          hToastr.success("Add service successfully!");
          dispatch(closeHTTPModal());
          dispatch(fetchHTTPServices(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function testHTTPService(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/httpservices/test`,
      {
        method: "POST",
        dataType: "json",
        data: $("#httpForm").serializeArray(),
        success: function(data) {
          hToastr.success("Test service successfully!");
          dispatch(renderHTTPTestOutputAction(data));
        }.bind(this),
        error: function(xhr, status, err) {
          hToastr.error("Test service failed!");
          let errStruct = JSON.parse(xhr.responseText);
          if (errStruct) {
            dispatch(renderHTTPTestOutputAction(errStruct["error"]));
          } else {
            dispatch(renderHTTPTestOutputAction("Unknown error"));
          }
        }.bind(this)
      }
    )
  }
}

function fetchHTTPServices(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, HTTP_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/httpservices/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderHTTPServicesAction(alertID, data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
          dispatch(renderHTTPServicesAction(alertID, []));
        }
      }
    )
  }
}

function renderHTTPTestOutputAction(output) {
  return {
    type: ACTION_FETCH_HTTP_TEST,
    output: output,
  }
}


function renderHTTPServicesAction(alertID, services) {
  return {
    type: ACTION_FETCH_HTTP_DATA,
    alertID: alertID,
    httpServices: services,
  }
}

export {openHTTPModal, closeHTTPModal, deleteHTTPService, addHTTPService, updateHTTPService, fetchHTTPServices, testHTTPService};