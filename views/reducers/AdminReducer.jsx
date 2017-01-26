import { ACTION_FETCH_ADMIN_DATA, ACTION_OPEN_ADMIN_MODAL, ACTION_CLOSE_ADMIN_MODAL } from "../common/Constants";

function adminReducer(state = {alertID: 0, admins: [], adminData: {}, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_FETCH_ADMIN_DATA:
      return {
        alertID: action.alertID,
        admins: action.admins,
        adminData: state.adminData,
        isOpen: state.isOpen,
      };
    case ACTION_OPEN_ADMIN_MODAL:
      return {
        alertID: state.alertID,
        admins: state.admins,
        adminData: action.adminData,
        isOpen: true,
      };
    case ACTION_CLOSE_ADMIN_MODAL:
      return {
        alertID: state.alertID,
        admins: state.admins,
        adminData: [],
        isOpen: false,
      };
    default:
      return state;
  }
}

export default adminReducer;