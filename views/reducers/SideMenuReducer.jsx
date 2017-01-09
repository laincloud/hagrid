import { ALERT_PAGE } from "../common/Constants";
import { ACTION_OPEN_CONTENT, ACTION_SWITCH_ALERT } from "../common/Constants";

function sideMenuReducer(state = {alertID: 0, pageMode: ALERT_PAGE}, action) {
  switch(action.type) {
    case ACTION_OPEN_CONTENT:
      return {
        alertID: action.alertID,
        pageMode: action.pageMode,
      };
    case ACTION_SWITCH_ALERT:
      return {
        alertID: action.alertID,
      };
    default:
      return state;
  }
}

export default sideMenuReducer;