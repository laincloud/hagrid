import React, { Component } from "react";
import store from "../../common/Store";
import { connect, Provider } from 'react-redux';
import AlertSelector from "../alert/AlertSelector";
import UserProfileModal from "../user/UserProfileModal";
import AlertModal from "../alert/AlertModal";
import { openUserProfileModal } from "../../actions/UserAction";
import { openAlertModal } from "../../actions/AlertAction";
import $ from "jquery";
import "bootstrap";
import "jquery.cookie";

export default class NavigatorToggleable extends Component {

  componentDidMount() {
    $('.dropdown-toggle').dropdown();
  }


  logout() {
    $.removeCookie('session-name', {path: '/'});
    location.href = "/logout";
  }

  render() {
    return (
      <div className="navbar-toggleable">
        <nav id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            <li className="visible-xs-block">
              <h4 className="navbar-text text-center">Hi, Teddy Wilson</h4>
            </li>
            <li className="hidden-xs hidden-sm">
              <form className="navbar-search" aria-expanded="true">
                <div className="navbar-search-group">
                  <div className="input-group">
                      <span className="input-group-addon">
                        <span className="icon icon-database icon-lg"/>
                      </span>
                    <Provider store={store}>
                      <AlertSelector />
                    </Provider>
                    <Provider store={store}>
                      <UserProfileModal />
                    </Provider>
                    <Provider store={store}>
                      <AlertModal />
                    </Provider>
                  </div>
                </div>
              </form>
            </li>
            <li className="dropdown hidden-xs">
              <button className="navbar-account-btn" data-toggle="dropdown" aria-haspopup="true">
                <img className="rounded" width="36" height="36" src="static/img/0180441436.jpg" alt="Teddy Wilson"/>
                Settings
                <span className="caret"/>
              </button>
              <ul className="dropdown-menu dropdown-menu-right">
                <li><a onClick={() => store.dispatch(openUserProfileModal())}>Profile</a></li>
                <li><a onClick={() => store.dispatch(openAlertModal())}>Add alert</a></li>
                <li className="divider"/>
                <li><a onClick={this.logout}>Sign out</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>)
  }
}