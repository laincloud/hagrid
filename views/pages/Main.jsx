import React, {Component} from "react";
import SideMenu from "./SideMenu";
import Content from "./Content";

export default class MainPage extends Component {
  render() {
    return (
      <div className="layout-main">
        <SideMenu />
        <Content />
      </div>
    )
  }
}