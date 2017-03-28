import React, {Component} from "react";
import SideMenu from "./SideMenu";
import Content from "./Content";
import { Provider } from "react-redux";
import store from "../common/Store";

export default class MainPage extends Component {
  render() {
    return (
      <div className="layout-main">
        <Provider store={store}>
          <SideMenu />
        </Provider>
        <Provider store={store}>
          <Content />
        </Provider>
      </div>
    )
  }
}