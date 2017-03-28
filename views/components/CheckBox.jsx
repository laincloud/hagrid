import React, { Component } from "react";
import { STYLE_DEFAULT }from "../common/Constants";

export default class CheckBox extends Component {
  render() {
    const width = this.props.width ? this.props.width : 6;
    const cbStyle = this.props.cbStyle ? this.props.cbStyle : STYLE_DEFAULT;
    const checked = this.props.isChecked ? "checked" : false;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <div className="custom-controls-stacked m-t">
            <label className={`custom-control custom-control-${cbStyle} custom-checkbox`}>
              <input id={this.props.id} name={this.props.name} className="custom-control-input" type="checkbox" defaultChecked={checked}/>
              <span className="custom-control-indicator"/>
            </label>
          </div>
        </div>
      </div>
    )
  }
}