import React, { Component } from "react";
import { connect } from "react-redux";
import { ALERT_PAGE } from "../common/Constants";
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
                <MenuItem icon="icon-home" url="#" handleClick={() => {store.dispatch(openContentAction(alertID, ALERT_PAGE))}} title="Alert"/>
                <li className="sidenav-heading">Services</li>
                <MenuItem icon="icon-bar-chart-o" url="#" handleClick={() => {store.dispatch(fetchGraphiteServices(alertID))}} title="Graphite"/>
                <MenuItem icon="icon-server" url="#" handleClick={() => {store.dispatch(fetchTCPServices(alertID))}} title="TCP"/>
                <MenuItem icon="icon-sitemap" url="#" title="HTTP"/>
                <li className="sidenav-heading">Management</li>
                <MenuItem icon="icon-font" url="#" handleClick={() => {store.dispatch(fetchTemplates(alertID))}} title="Templates"/>
                <MenuItem icon="icon-bell" url="#" handleClick={() => {store.dispatch(fetchNotifiers(alertID))}} title="Notifiers"/>
                <MenuItem icon="icon-cog" url="#" handleClick={() => {store.dispatch(fetchAdmins(alertID))}} title="Administrators"/>
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

