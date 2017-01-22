import React, { Component } from "react";
import { STYLE_DEFAULT } from "../common/Constants";

export default class Label extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let labelStyle = this.props.isOutline ?
      `label label-outline-${this.props.labelStyle} m-r m-b`:
      `label label-${this.props.labelStyle} m-r m-b`;
    return (
      <div className={labelStyle}>
        {this.props.text}
      </div>
    )
  }
}