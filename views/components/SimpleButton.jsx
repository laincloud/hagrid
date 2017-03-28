import React, { Component } from "react";
import { SIZE_DEFAULT, STYLE_DEFAULT } from "../common/Constants";

export default class SimpleButton extends Component {

  get defaultProps() {
    return {
      btSize: SIZE_DEFAULT,
      btStyle: STYLE_DEFAULT,
      isDisabled: false,
      isOutline: false,
      isSpin: false,
      isIcon: false,
      text: "",
    }

  }

  clickFunc() {
    this.props.handleClick();
  }

  render() {
    let outlineStyle = this.props.isOutline ? "-outline" : "";
    let spinStyle = this.props.isSpin ? "spinner spinner-inverse spinner-sm" : "";
    let sizeStyle = this.props.btSize ? `btn-${this.props.btSize}` : "";
    let iconStyle = this.props.isIcon ? "btn-icon sq-18" : "";
    const btClass = `btn btn${outlineStyle}-${this.props.btStyle} ${sizeStyle} ${spinStyle} ${iconStyle}`;
    if (this.props.isDisabled) {
      return (
        <button className={btClass} onClick={this.clickFunc.bind(this)} type="button" disabled="disabled">{this.props.text}</button>
      )
    } else {
      return (
        <button className={btClass} onClick={this.clickFunc.bind(this)} type="button">{this.props.text}</button>
      )
    }

  }
}