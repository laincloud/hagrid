import React, { Component } from "react";
import { connect } from "react-redux";
import { ALERT_PAGE, TCP_PAGE } from "../common/Constants";
import MenuItem from '../components/MenuItem';
import store from "../common/Store";
import { openContentAction } from "../actions/SideMenuAction";
import { fetchGraphiteServices } from "../actions/GraphiteServiceAction"

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
                <MenuItem icon="icon-dashboard" url="#" handleClick={() => {store.dispatch(openContentAction(alertID, ALERT_PAGE))}} title="Alert"/>
                <li className="sidenav-heading">Services</li>
                <MenuItem icon="icon-bar-chart-o" url="#" handleClick={() => {store.dispatch(fetchGraphiteServices(alertID))}} title="Graphite"/>
                <MenuItem icon="icon-server" url="#" handleClick={() => {store.dispatch(openContentAction(alertID, TCP_PAGE))}} title="TCP"/>
                <MenuItem icon="icon-sitemap" url="#" title="HTTP"/>
                <li className="sidenav-heading">Management</li>
                <MenuItem icon="icon-font" url="#" title="Templates"/>
                <MenuItem icon="icon-bell" url="#" title="Notifiers"/>
                <MenuItem icon="icon-cog" url="#" title="Administrators"/>
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

