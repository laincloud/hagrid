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
      text: "",
      clickParams: [],
    }

  }

  clickFunc() {
    if (this.props.handleClick) {
      const params = this.props.clickParams ? this.props.clickParams : [];
      this.props.handleClick(...params);
    }
  }

  render() {
    let outlineStyle = this.props.isOutline ? "-outline" : "";
    let spinStyle = this.props.isSpin ? "spinner spinner-inverse spinner-sm" : "";
    let sizeStyle = this.props.size ? `btn-${this.props.btSize}` : "";
    const btClass = `btn btn${outlineStyle}-${this.props.btStyle} ${sizeStyle} ${spinStyle}`;
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