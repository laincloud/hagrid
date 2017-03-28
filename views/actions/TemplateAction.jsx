import { ACTION_OPEN_TEMPLATE_MODAL, ACTION_CLOSE_TEMPLATE_MODAL, ACTION_FETCH_TEMPLATE_DATA, TEMPLATE_PAGE } from "../common/Constants";
import { openContentAction } from "../actions/SideMenuAction";
import hToastr from "../components/HagridToastr";
import $ from "jquery";
import { outputErrorMsg } from "../common/Utils";

function openTemplateModal(templateData, mode) {
  return {
    type: ACTION_OPEN_TEMPLATE_MODAL,
    templateData: templateData,
    mode: mode,
  };
}

function closeTemplateModal() {
  return {
    type: ACTION_CLOSE_TEMPLATE_MODAL,
    templateData: {},
  }
}

function deleteTemplate(templateID, alertID) {
  return function(dispatch) {
    dispatch(closeTemplateModal());
    $.ajax(
      `/api/alerts/${alertID}/templates/${templateID}`,
      {
        method: "DELETE",
        dataType: "json",
        success: function() {
          hToastr.warning("Template has been deleted");
          dispatch(fetchTemplates(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  };
}

function updateTemplate(templateID, alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/templates/${templateID}`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#templateForm").serializeArray(),
        success: function() {
          hToastr.success("Update template successfully!");
          dispatch(closeTemplateModal());
          dispatch(fetchTemplates(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }

}

function addTemplate(alertID) {
  return function(dispatch) {
    $.ajax(
      `/api/alerts/${alertID}/templates/`,
      {
        method: "POST",
        dataType: "json",
        data: $("#templateForm").serializeArray(),
        success: function() {
          hToastr.success("Add template successfully!");
          dispatch(closeTemplateModal());
          dispatch(fetchTemplates(alertID));
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function fetchTemplates(alertID) {
  return function(dispatch) {
    dispatch(openContentAction(alertID, TEMPLATE_PAGE));
    $.ajax(
      `/api/alerts/${alertID}/templates/all`,
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderTemplatesAction(alertID, data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
          dispatch(renderTemplatesAction(alertID, []));
        }
      }
    )
  }
}

function renderTemplatesAction(alertID, templates) {
  return {
    type: ACTION_FETCH_TEMPLATE_DATA,
    alertID: alertID,
    templates: templates,
  }
}

export {openTemplateModal, closeTemplateModal, deleteTemplate, addTemplate, updateTemplate, fetchTemplates};