import { MODE_ADD, ACTION_CLOSE_GRAPHITE_MODAL, ACTION_OPEN_GRAPHITE_MODAL, ACTION_FETCH_GRAPHITE_DATA } from "../common/Constants"

function graphiteServiceReducer(state = {serviceData: {}, mode: MODE_ADD, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_OPEN_GRAPHITE_MODAL:
      return {
        serviceData: action.serviceData,
        mode: action.mode,
        isOpen: true,
      };
    case ACTION_CLOSE_GRAPHITE_MODAL:
      return {
        serviceData: action.serviceData,
        mode: state.mode,
        isOpen: false,
      };
    default:
      return state;
  }
}

function graphiteServiceListReducer(state = {alertID: 3, graphiteServices: []}, action) {
  switch(action.type) {
    case ACTION_FETCH_GRAPHITE_DATA:
      return {
        alertID: action.alertID,
        graphiteServices: action.graphiteServices,
      };
    default:
      return state;
  }
}

export {graphiteServiceReducer, graphiteServiceListReducer};