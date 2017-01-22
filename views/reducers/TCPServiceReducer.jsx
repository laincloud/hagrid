import { MODE_ADD, ACTION_CLOSE_TCP_MODAL, ACTION_OPEN_TCP_MODAL, ACTION_FETCH_TCP_DATA } from "../common/Constants"

function tcpServiceReducer(state = {serviceData: {}, mode: MODE_ADD, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_OPEN_TCP_MODAL:
      return {
        serviceData: action.serviceData,
        mode: action.mode,
        isOpen: true,
      };
    case ACTION_CLOSE_TCP_MODAL:
      return {
        serviceData: action.serviceData,
        mode: state.mode,
        isOpen: false,
      };
    default:
      return state;
  }
}

function tcpServiceListReducer(state = {alertID: 3, tcpServices: []}, action) {
  switch(action.type) {
    case ACTION_FETCH_TCP_DATA:
      return {
        alertID: action.alertID,
        tcpServices: action.tcpServices,
      };
    default:
      return state;
  }
}

export {tcpServiceReducer, tcpServiceListReducer};