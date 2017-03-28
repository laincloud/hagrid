import { MODE_ADD, ACTION_CLOSE_HTTP_MODAL, ACTION_OPEN_HTTP_MODAL, ACTION_FETCH_HTTP_DATA, ACTION_FETCH_HTTP_TEST } from "../common/Constants"

function httpServiceReducer(state = {serviceData: {}, mode: MODE_ADD, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_OPEN_HTTP_MODAL:
      return {
        serviceData: action.serviceData,
        mode: action.mode,
        isOpen: true,
      };
    case ACTION_CLOSE_HTTP_MODAL:
      return {
        serviceData: action.serviceData,
        mode: state.mode,
        isOpen: false,
      };
    default:
      return state;
  }
}

function httpServiceListReducer(state = {alertID: 0, httpServices: []}, action) {
  switch(action.type) {
    case ACTION_FETCH_HTTP_DATA:
      return {
        alertID: action.alertID,
        httpServices: action.httpServices,
      };
    default:
      return state;
  }
}

function httpTestReducer(state = {output: ""}, action) {
  switch(action.type) {
    case ACTION_FETCH_HTTP_TEST:
      return {
        output: action.output,
      };
    default:
      return state;
  }
}

export {httpServiceReducer, httpServiceListReducer, httpTestReducer};