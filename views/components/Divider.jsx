import React, { Component } from "react";

export default class Divider extends Component {
  render() {
    return (
      <div className="divider">
        <div className="divider-content">
          {this.props.content}
        </div>
      </div>
    )
  }
}