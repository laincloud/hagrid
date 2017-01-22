import { ACTION_FETCH_ALERT_DATA } from "../common/Constants";
function alertReducer(state = {alerts: []}, action) {
  switch(action.type) {
    case ACTION_FETCH_ALERT_DATA:
      return {
        alerts: action.alerts,
      };
    default:
      return state;
  }
}

export default alertReducer;