import React, { Component } from "react";
import NavigatorBar from "./navigator/NavigatorBar";

export default class HeaderPage extends Component {
  render() {
    return (
      <div className="layout-header">
        <NavigatorBar />
      </div>
    )
  }
}