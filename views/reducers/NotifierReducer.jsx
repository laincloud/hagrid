import { ACTION_FETCH_NOTIFIER_DATA, ACTION_OPEN_NOTIFIER_MODAL, ACTION_CLOSE_NOTIFIER_MODAL } from "../common/Constants";

function notifierReducer(state = {alertID: 0, notifiers: [], notifierData: {}, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_FETCH_NOTIFIER_DATA:
      return {
        alertID: action.alertID,
        notifiers: action.notifiers,
        notifierData: state.notifierData,
        isOpen: state.isOpen,
      };
    case ACTION_OPEN_NOTIFIER_MODAL:
      return {
        alertID: state.alertID,
        notifiers: state.notifiers,
        notifierData: action.notifierData,
        isOpen: true,
      };
    case ACTION_CLOSE_NOTIFIER_MODAL:
      return {
        alertID: state.alertID,
        notifiers: state.notifiers,
        notifierData: [],
        isOpen: false,
      };
    default:
      return state;
  }
}

export default notifierReducer;