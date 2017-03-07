import React, { Component } from "react";
import NavigatorHeader from "./NavigatorHeader";
import NavigatorToggleable from "./NavigatorToggleable";

export default class NavigatorBar extends Component {
  render() {
    return (
      <div className="navbar navbar-default">
        <NavigatorHeader />
        <NavigatorToggleable />
      </div>
    )
  }
}