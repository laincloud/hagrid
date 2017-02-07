import React, { Component } from "react";
import { connect } from "react-redux";
import { ALERT_PAGE, HELP_PAGE } from "../common/Constants";
import MenuItem from '../components/MenuItem';
import store from "../common/Store";
import { openContentAction } from "../actions/SideMenuAction";
import { fetchGraphiteServices } from "../actions/GraphiteServiceAction"
import { fetchTCPServices } from "../actions/TCPServiceAction";
import { fetchTemplates } from "../actions/TemplateAction";
import { fetchAdmins } from "../actions/AdminAction";
import { fetchNotifiers } from "../actions/NotifierAction";

class SideMenuComponent extends Component {
  render() {
    const alertID = this.props.alertID;
    return (
      <div className="layout-sidebar">
        <div className="layout-sidebar-backdrop"/>
        <div className="layout-sidebar-body">
          <div className="custom-scrollbar">
            <nav id="sidenav" className="sidenav-collapse collapse">
              <ul className="sidenav">
                <li className="sidenav-heading">Manage Alert</li>
                <MenuItem icon="icon-home" handleClick={() => {store.dispatch(openContentAction(alertID, ALERT_PAGE))}} title="Alert"/>
                <li className="sidenav-heading">Services</li>
                <MenuItem icon="icon-bar-chart-o" handleClick={() => {store.dispatch(fetchGraphiteServices(alertID))}} title="Graphite"/>
                <MenuItem icon="icon-server" handleClick={() => {store.dispatch(fetchTCPServices(alertID))}} title="TCP"/>
                {/*<MenuItem icon="icon-sitemap" title="HTTP"/>*/}
                <li className="sidenav-heading">Management</li>
                <MenuItem icon="icon-font" handleClick={() => {store.dispatch(fetchTemplates(alertID))}} title="Templates"/>
                <MenuItem icon="icon-bell" handleClick={() => {store.dispatch(fetchNotifiers(alertID))}} title="Notifiers"/>
                <MenuItem icon="icon-cog" handleClick={() => {store.dispatch(fetchAdmins(alertID))}} title="Administrators"/>
                <li className="sidenav-heading">Help</li>
                <MenuItem icon="icon-question-circle-o" handleClick={() => {store.dispatch(openContentAction(alertID, HELP_PAGE))}} title="Help"/>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    alertID: state.sideMenuReducer.alertID,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const SideMenu = connect(mapStateToProps, mapDispatchToProps)(SideMenuComponent);

export default SideMenu;

