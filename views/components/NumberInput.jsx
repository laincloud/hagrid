import React, { Component } from "react";
import { STYLE_DEFAULT }from "../common/Constants"

export default class NumberInput extends Component {

  ensureNumberInput(event) {
    if (event.charCode < 48 || event.charCode > 57) {
      event.preventDefault();
    }
  }

  componentDidMount() {
    const btClass = `btn btn-${this.props.btStyle ? this.props.btStyle : STYLE_DEFAULT}`;
    $(`#${this.props.id}`).TouchSpin({
      min: this.props.minValue ? this.props.minValue : 0,
      max: this.props.maxValue ? this.props.maxValue : 1000,
      step: 1,
      decimals: 0,
      prefix: this.props.prefix ? this.props.prefix : "",
      postfix: this.props.postfix ? this.props.postfix : "",
      buttondown_class: btClass,
      buttonup_class: btClass,
    })
  }

  render() {
    const width = this.props.width ? this.props.width : 6;
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={this.props.id}>{this.props.title}</label>
        <div className={`col-sm-${width}`}>
          <input
            id={this.props.id}
            name={this.props.name}
            className="form-control"
            style={{imeMode:"disabled"}}
            type="text"
            defaultValue={this.props.defaultValue}
            onKeyPress={(event) =>{this.ensureNumberInput(event)}}/>
        </div>
      </div>
    )
  }
}