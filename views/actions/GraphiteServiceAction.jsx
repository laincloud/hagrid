import { ACTION_OPEN_GRAPHITE_MODAL, ACTION_CLOSE_GRAPHITE_MODAL, MODE_UPDATE, GRAPHITE_PAGE } from "../common/Constants";
import { openContentAction } from "../actions/SideMenuAction";
import hToastr from "../components/HagridToastr"
import $ from "jquery";

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
          dispatch(openContentAction(alertID, GRAPHITE_PAGE))
        }.bind(this),
        error: function(xhr, status, err) {
          console.log(xhr.responseText)
        }.bind(this)
      }
    )
  };
}

function updateGraphiteService() {

}

function addGraphiteService() {

}

export {openGraphiteModal, closeGraphiteModal, deleteGraphiteService};