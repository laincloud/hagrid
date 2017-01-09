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

export {openGraphiteModal, closeGraphiteModal};