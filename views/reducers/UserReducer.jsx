import { ACTION_OPEN_USER_MODAL, ACTION_CLOSE_USER_MODAL } from "../common/Constants"

function userReducer(state = {userData: {}, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_OPEN_USER_MODAL:
      return {
        userData: action.userData,
        isOpen: true,
      };
    case ACTION_CLOSE_USER_MODAL:
      return {
        userData: action.userData,
        isOpen: false,
      };
    default:
      return state;
  }
}

export default userReducer;