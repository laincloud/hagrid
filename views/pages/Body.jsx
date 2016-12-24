import React, { Component } from "react";
import HeaderPage from "./Header";
import MainPage from "./Main";
import FooterPage from "./Footer";

export default class BodyPage extends Component {
    render() {
        return (
          <div>
              <HeaderPage/>
              <MainPage />
              <FooterPage />
          </div>
        )
    }
}
