import React, {Component} from "react";
import MenuItem from '../components/MenuItem';

export default class SideMenu extends Component {
  render() {
    return (
      <div className="layout-sidebar">
        <div className="layout-sidebar-backdrop"/>
        <div className="layout-sidebar-body">
          <div className="custom-scrollbar">
            <nav id="sidenav" className="sidenav-collapse collapse">
              <ul className="sidenav">
                <li className="sidenav-heading">Services</li>
                <MenuItem icon="icon-bar-chart-o" url="/hagrid/1/graphiteservices" title="Graphite"/>
                <MenuItem icon="icon-server" url="#" title="TCP"/>
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