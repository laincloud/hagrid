import { ACTION_OPEN_CONTENT, ACTION_SWITCH_ALERT, GRAPHITE_PAGE, TCP_PAGE, TEMPLATE_PAGE, ADMIN_PAGE } from "../common/Constants";
import store from "../common/Store";
import { fetchGraphiteServices } from "./GraphiteServiceAction";
import { fetchTCPServices } from "./TCPServiceAction";
import { fetchTemplates } from "./TemplateAction";
import { fetchAdmins } from "./AdminAction";

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
      case TEMPLATE_PAGE:
        dispatch(fetchTemplates(alertID));
        break;
      case ADMIN_PAGE:
        dispatch(fetchAdmins(alertID));
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