import { ACTION_OPEN_USER_MODAL, ACTION_CLOSE_USER_MODAL } from "../common/Constants";
import $ from "jquery";
import hToastr from "../components/HagridToastr";
import { outputErrorMsg } from "../common/Utils";

function updateUserProfile() {
  return function(dispatch) {
    $.ajax(
      `/api/users`,
      {
        method: "PUT",
        dataType: "json",
        data: $("#userProfileForm").serializeArray(),
        success: function() {
          hToastr.success("Update profile successfully!");
          dispatch(closeUserProfileModal());
        }.bind(this),
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }.bind(this)
      }
    )
  }
}

function openUserProfileModal() {
  return function(dispatch) {
    $.ajax(
      '/api/users/me',
      {
        method: "GET",
        dataType: "json",
        success: function(data) {
          dispatch(renderUserProfileAction(data));
        },
        error: function(xhr, status, err) {
          outputErrorMsg(xhr.responseText);
        }
      }
    )
  }
}

function closeUserProfileModal() {
  return {
    type: ACTION_CLOSE_USER_MODAL,
    userData: {},
  }
}

function renderUserProfileAction(userData) {
  return {
    type: ACTION_OPEN_USER_MODAL,
    userData: userData,
  };
}

export {openUserProfileModal, closeUserProfileModal, updateUserProfile}