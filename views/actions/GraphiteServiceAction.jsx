import { ACTION_OPEN_GRAPHITE_MODAL, ACTION_CLOSE_GRAPHITE_MODAL, MODE_UPDATE } from "../common/Constants";

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

function deleteGraphiteService(id) {
  return function(dispatch) {
    dispatch(closeGraphiteModal());
    console.log("Close " + id);
  };
}

function getGraphiteService() {

}

function updateGraphiteService() {

}

function addGraphiteService() {

}

export {openGraphiteModal, closeGraphiteModal, deleteGraphiteService};