import { ACTION_OPEN_CONTENT, ACTION_SWITCH_ALERT } from "../common/Constants";

function openContentAction(alertID, pageMode) {
  return {
    type: ACTION_OPEN_CONTENT,
    alertID: alertID,
    pageMode: pageMode,
  };
}

function switchAlertAction(alertID) {
  return {
    type: ACTION_SWITCH_ALERT,
    alertID: alertID,
  }
}

export {openContentAction, switchAlertAction};