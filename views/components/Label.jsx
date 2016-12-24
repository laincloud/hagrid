import React, { Component } from "react";
import { STYLE_DEFAULT } from "../common/Constants";

export default class Label extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let labelStyle = `label label-${STYLE_DEFAULT}`;
    if (this.props.isOutline) {
      labelStyle = `label label-outline-${this.props.labelStyle}`
    } else {
      labelStyle = `label label-${this.props.labelStyle}`
    }

    return (
      <span className={labelStyle}>
        {this.props.text}
      </span>
    )
  }
}