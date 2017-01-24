import { ACTION_FETCH_ALERT_DATA, ACTION_OPEN_ALERT_MODAL, ACTION_CLOSE_ALERT_MODAL } from "../common/Constants";
function alertReducer(state = {alerts: [], isOpen: false}, action) {
  switch(action.type) {
    case ACTION_FETCH_ALERT_DATA:
      return {
        alerts: action.alerts,
        isOpen: state.isOpen,
      };
    case ACTION_OPEN_ALERT_MODAL:
      return {
        alerts: state.alerts,
        isOpen: true,
      };
    case ACTION_CLOSE_ALERT_MODAL:
      return {
        alerts: state.alerts,
        isOpen: false,
      };
    default:
      return state;
  }
}

export default alertReducer;