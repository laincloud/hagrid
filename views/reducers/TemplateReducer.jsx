import { MODE_ADD, ACTION_CLOSE_TEMPLATE_MODAL, ACTION_OPEN_TEMPLATE_MODAL, ACTION_FETCH_TEMPLATE_DATA } from "../common/Constants"

function templateReducer(state = {templateData: {}, mode: MODE_ADD, isOpen: false}, action) {
  switch(action.type) {
    case ACTION_OPEN_TEMPLATE_MODAL:
      return {
        templateData: action.templateData,
        mode: action.mode,
        isOpen: true,
      };
    case ACTION_CLOSE_TEMPLATE_MODAL:
      return {
        templateData: action.templateData,
        mode: state.mode,
        isOpen: false,
      };
    default:
      return state;
  }
}

function templateListReducer(state = {alertID: 0, templates: []}, action) {
  switch(action.type) {
    case ACTION_FETCH_TEMPLATE_DATA:
      return {
        alertID: action.alertID,
        templates: action.templates,
      };
    default:
      return state;
  }
}

export {templateReducer, templateListReducer};