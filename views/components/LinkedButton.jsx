import React, { Component } from "react";

export default class LinkedButton extends Component {

  clickFunc() {
    this.props.handleClick(...this.props.clickParams);
  }

  render() {
    return (
      <li>
        <a href={this.props.url} onClick={this.clickFunc.bind(this)}>{this.props.text}</a>
      </li>
    )
  }
}