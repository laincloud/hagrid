import { ACTION_OPEN_CONTENT, ACTION_SWITCH_ALERT, GRAPHITE_PAGE, TCP_PAGE } from "../common/Constants";
import store from "../common/Store";
import { fetchGraphiteServices } from "./GraphiteServiceAction";
import { fetchTCPServices } from "./TCPServiceAction";

// callTime used to force update the page
function openContentAction(alertID, pageMode) {
  return {
    type: ACTION_OPEN_CONTENT,
    alertID: alertID,
    pageMode: pageMode,
  };
}

function refreshContentAction(alertID) {
  return function(dispatch) {
    dispatch(switchAlertAction(alertID));
    switch (store.getState().sideMenuReducer.pageMode) {
      case GRAPHITE_PAGE:
        dispatch(fetchGraphiteServices(alertID));
        break;
      case TCP_PAGE:
        dispatch(fetchTCPServices(alertID));
        break;
      default:
        break;
    }
  }
}

function switchAlertAction(alertID) {
  return {
    type: ACTION_SWITCH_ALERT,
    alertID: alertID,
  }
}

export {openContentAction, switchAlertAction, refreshContentAction};